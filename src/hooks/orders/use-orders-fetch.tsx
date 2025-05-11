
import { useCallback, useEffect } from 'react';
import { Order, RawOrder } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { fetchPaginatedOrders, transformRawOrder } from '@/services/orderService';
import { supabase } from '@/integrations/supabase/client';

export interface FetchOrdersOptions {
  page: number;
  setLoading: (loading: boolean) => void;
  setOrders: (orders: Order[] | ((prevOrders: Order[]) => Order[])) => void;
  setTotalPages: (totalPages: number) => void;
  selectedOrder: Order | null;
  setViewDialogOpen: (open: boolean) => void;
  setSelectedOrder: (order: Order | null) => void;
}

export const useOrdersFetch = ({
  page,
  setLoading,
  setOrders,
  setTotalPages,
  selectedOrder,
  setViewDialogOpen,
  setSelectedOrder,
}: FetchOrdersOptions) => {
  const { toast } = useToast();
  const ordersPerPage = 10;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching orders for page:", page);
      const { orders: fetchedOrders, totalPages: calculatedTotalPages } = 
        await fetchPaginatedOrders(page, ordersPerPage);
      
      console.log("Fetched orders count:", fetchedOrders.length);
      
      // Transform raw orders to Order type
      const transformedOrders = fetchedOrders.map(transformRawOrder);
      
      setOrders(transformedOrders);
      setTotalPages(calculatedTotalPages);
      console.log("Updated state with orders and total pages:", transformedOrders.length, calculatedTotalPages);
      return transformedOrders; // Return orders for chaining
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement des commandes.",
        variant: "destructive",
      });
      throw err; // Re-throw for better error handling upstream
    } finally {
      setLoading(false);
    }
  }, [page, toast, setLoading, setOrders, setTotalPages]);

  // Set up real-time subscription for order changes
  useEffect(() => {
    console.log("Orders hook initialized, fetching initial data");
    fetchOrders();
    
    // Set up a subscription to listen for changes to orders with improved error handling
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
            setOrders((prevOrders: Order[]) => prevOrders.filter(order => order.id !== deletedOrderId));
            
            // Close the dialog if the deleted order was being viewed
            if (selectedOrder && selectedOrder.id === deletedOrderId) {
              setViewDialogOpen(false);
              setSelectedOrder(null);
            }
          } else if (payload.eventType === 'INSERT') {
            console.log('New order inserted, refreshing order list');
            fetchOrders(); // Refresh orders on insert
          } else {
            // For other events, refresh the order list to keep UI in sync
            fetchOrders();
          }
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      console.log("Cleaning up supabase channel subscription");
      supabase.removeChannel(ordersChannel);
    };
  }, [fetchOrders, selectedOrder, setOrders, setViewDialogOpen, setSelectedOrder]);

  return { fetchOrders };
};
