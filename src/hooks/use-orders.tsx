
import { useState, useEffect } from 'react';
import { Order, OrderStatus, RawOrder } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchPaginatedOrders, 
  deleteOrder as deleteOrderService,
  updateOrderStatus as updateOrderStatusService,
  transformRawOrder
} from '@/services/order';
import { generateOrderPDF } from '@/utils/pdf';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders: fetchedOrders, totalPages: calculatedTotalPages } = 
        await fetchPaginatedOrders(page, ordersPerPage);
      
      // Transform raw orders to Order type
      const transformedOrders = fetchedOrders.map(transformRawOrder);
      
      setOrders(transformedOrders);
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement des commandes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up a subscription to listen for changes to orders
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'Orders'
        },
        (payload) => {
          console.log('Orders table changed:', payload);
          
          // If a delete event is received, update the UI
          if (payload.eventType === 'DELETE' && payload.old && payload.old.id) {
            const deletedOrderId = payload.old.id;
            setOrders(prevOrders => prevOrders.filter(order => order.id !== deletedOrderId));
            
            // Close the dialog if the deleted order was being viewed
            if (selectedOrder && selectedOrder.id === deletedOrderId) {
              setViewDialogOpen(false);
              setSelectedOrder(null);
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            // For update events, update the specific order in the UI
            const updatedOrder = transformRawOrder(payload.new as RawOrder);
            setOrders(prevOrders => prevOrders.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            ));
            
            // Also update the selected order if it's being viewed
            if (selectedOrder && selectedOrder.id === updatedOrder.id) {
              setSelectedOrder(updatedOrder);
            }
          } else if (payload.eventType === 'INSERT') {
            // For insert events, refresh the order list
            fetchOrders();
          }
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(ordersChannel);
    };
  }, [page]); // Only refresh when the page changes

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Delete from the database first
      await deleteOrderService(orderId);
      
      // Then update the UI after confirmation of deletion
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      // Close the dialog if the deleted order was being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setViewDialogOpen(false);
        setSelectedOrder(null);
      }
      
      toast({
        title: "Succès",
        description: "La commande a été supprimée avec succès.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la commande.",
        variant: "destructive",
      });
      // Refresh to ensure UI accuracy
      fetchOrders();
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatusService(orderId, status as OrderStatus);

      toast({
        title: "Succès",
        description: `Le statut de la commande a été mis à jour.`,
      });
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: status as OrderStatus } : order
      ));
      
      // Update the selected order if it's the one being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: status as OrderStatus });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du statut.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = (order: Order) => {
    try {
      generateOrderPDF(order);
      
      toast({
        title: "PDF généré",
        description: `La commande #${order.id} a été téléchargée en PDF.`
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du PDF.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    orders,
    loading,
    selectedOrder,
    viewDialogOpen,
    page,
    totalPages,
    fetchOrders,
    handleViewOrder,
    handleDeleteOrder,
    handleUpdateStatus,
    handleGeneratePDF,
    handlePageChange,
    setViewDialogOpen
  };
};
