import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order, RawOrder, OrderItem } from '@/types/order';
import { OrdersList } from './orders/OrdersList';
import { OrderDetailsDialog } from './orders/OrderDetailsDialog';
import { generateOrderPDF } from '@/utils/pdfUtils';

// Define the type for the delete_order_by_id RPC function parameters
interface DeleteOrderParams {
  order_id: number;
}

const OrdersManager: React.FC = () => {
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
      // First get total count for pagination
      const { count, error: countError } = await supabase
        .from('Orders')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error getting order count:', countError);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer le nombre total de commandes.",
          variant: "destructive",
        });
        return;
      }

      // Calculate total pages
      const totalItems = count || 0;
      const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / ordersPerPage));
      setTotalPages(calculatedTotalPages);

      // Fetch paginated orders
      const fromIndex = (page - 1) * ordersPerPage;
      const toIndex = fromIndex + ordersPerPage - 1;

      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(fromIndex, toIndex);

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
          
          // If a delete event is received, update the UI
          if (payload.eventType === 'DELETE' && payload.old && payload.old.id) {
            const deletedOrderId = payload.old.id;
            setOrders(prevOrders => prevOrders.filter(order => order.id !== deletedOrderId));
          } else {
            // For other events, refresh the order list to keep UI in sync
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
      setLoading(true); // Set loading state
      
      // First, update the local state to give immediate feedback
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      // Close the dialog if the deleted order was being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setViewDialogOpen(false);
        setSelectedOrder(null);
      }
      
      // Delete from the database using Supabase's delete method with explicit await
      console.log(`Attempting to delete order ${orderId} from database`);
      const { error } = await supabase
        .from('Orders')
        .delete()
        .eq('id', orderId);
      
      if (error) {
        console.error('Error in first deletion attempt:', error);
        
        // Try again with a different approach if the first attempt failed
        console.log(`Trying second delete approach for order ${orderId}`);
        const { error: secondAttemptError } = await supabase
          .from('Orders')
          .delete()
          .match({ id: orderId });
        
        if (secondAttemptError) {
          console.error('Second deletion attempt failed:', secondAttemptError);
          
          // Try a third approach with a raw query if needed
          console.log(`Trying third delete approach with raw query for order ${orderId}`);
          // Fix: Use any for the return type to avoid type constraint issues
          const { error: thirdAttemptError } = await supabase.rpc<any, DeleteOrderParams>(
            'delete_order_by_id',
            { order_id: Number(orderId) }
          );
          
          if (thirdAttemptError) {
            console.error('All deletion attempts failed:', thirdAttemptError);
            throw new Error(`Failed to delete order ${orderId} after multiple attempts`);
          }
        }
      }
      
      // Verify the deletion was successful by checking if the order still exists
      console.log(`Verifying deletion of order ${orderId}`);
      const { data: checkData } = await supabase
        .from('Orders')
        .select('id')
        .eq('id', orderId)
        .maybeSingle();
      
      if (checkData) {
        console.error(`Order ${orderId} still exists after deletion attempts:`, checkData);
        toast({
          title: "Erreur",
          description: "La commande n'a pas pu être supprimée de la base de données.",
          variant: "destructive",
        });
        
        // Force a complete refresh to ensure UI accuracy
        await fetchOrders();
      } else {
        // The order was successfully deleted
        console.log(`Order ${orderId} successfully deleted from database`);
        toast({
          title: "Succès",
          description: "La commande a été supprimée avec succès.",
        });
      }
    } catch (err) {
      console.error('Error in deleting order:', err);
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
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
