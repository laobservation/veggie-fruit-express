
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Order, RawOrder } from '@/types/order';
import { OrdersList } from './orders/OrdersList';
import { OrderDetailsDialog } from './orders/OrderDetailsDialog';
import { generateOrderPDF } from '@/utils/pdfUtils';

const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les commandes.",
          variant: "destructive",
        });
        return;
      }

      // Transform raw data to match our Order interface
      const transformedOrders: Order[] = (data as RawOrder[]).map(order => ({
        id: order.id,
        'Client Name': order['Client Name'] || '',
        'Adresse': order['Adresse'] || '',
        'Phone': order['Phone'],
        // Parse the JSON string into OrderItem[] if it exists
        order_items: Array.isArray(order.order_items) ? order.order_items as unknown as OrderItem[] : [],
        total_amount: order.total_amount || 0,
        preferred_time: order.preferred_time || null,
        status: order.status || 'new',
        notified: order.notified || false,
        created_at: order.created_at
      }));

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error in fetching orders:', err);
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
          
          // Direct state update based on the operation type
          if (payload.eventType === 'DELETE') {
            // Immediately remove the deleted order from local state
            const deletedId = payload.old?.id;
            if (deletedId) {
              setOrders(prevOrders => prevOrders.filter(order => order.id !== deletedId));
              
              // Close dialog if deleted order was being viewed
              if (selectedOrder?.id === deletedId) {
                setViewDialogOpen(false);
                setSelectedOrder(null);
              }
            }
          } else {
            // For other changes (INSERT, UPDATE), refresh the orders
            fetchOrders();
          }
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(ordersChannel);
    };
  }, [selectedOrder]);

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('Orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la commande.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "La commande a été supprimée avec succès.",
      });
      
      // Remove the deleted order from the local state immediately
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      // Close the dialog if the deleted order was being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setViewDialogOpen(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error in deleting order:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la commande.",
        variant: "destructive",
      });
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      const { error } = await supabase
        .from('Orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de la commande.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: `Le statut de la commande a été mis à jour.`,
      });
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      // Update the selected order if it's the one being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
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

  return (
    <div>
      <OrdersList
        orders={orders}
        loading={loading}
        onRefresh={fetchOrders}
        onView={handleViewOrder}
        onDelete={handleDeleteOrder}
        onUpdateStatus={handleUpdateStatus}
        onGeneratePDF={handleGeneratePDF}
      />
      
      <OrderDetailsDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        order={selectedOrder}
        onDelete={handleDeleteOrder}
        onGeneratePDF={handleGeneratePDF}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrdersManager;
