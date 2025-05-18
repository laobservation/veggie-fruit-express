
import React, { useCallback, useEffect } from 'react';
import { OrdersList } from './orders/OrdersList';
import { OrderDetailsDialog } from './orders/OrderDetailsDialog';
import { useOrders } from '@/hooks/use-orders';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OrderStatus } from '@/types/order';

const OrdersManager: React.FC = () => {
  const {
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
    setViewDialogOpen,
    refreshOrders,
    setOrders
  } = useOrders();

  // Force refresh on component mount and set up polling
  useEffect(() => {
    // Immediate refresh when component mounts
    refreshOrders();
    
    // Set up real-time subscription for order changes
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Orders'
        },
        (payload) => {
          console.log('Orders table changed:', payload);
          
          // For updates, we can update the order in state directly
          if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new;
            setOrders(currentOrders => 
              currentOrders.map(order => 
                order.id === updatedOrder.id ? {
                  ...order,
                  status: updatedOrder.status as OrderStatus
                } : order
              )
            );
            
            // If the updated order is the selected one, update it in the dialog too
            if (selectedOrder && selectedOrder.id === updatedOrder.id) {
              handleViewOrder({
                ...selectedOrder,
                status: updatedOrder.status as OrderStatus
              });
            }
            
            toast.success(`Statut de la commande #${updatedOrder.id} mis à jour: ${updatedOrder.status}`);
          } else {
            // For inserts and deletes, refresh the whole list
            refreshOrders();
          }
        }
      )
      .subscribe();
      
    // Set up more frequent polling as a fallback
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 60000); // Poll every minute
    
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(ordersChannel);
    };
  }, [refreshOrders]); // Add refreshOrders to dependency array

  return (
    <div>
      <OrdersList
        orders={orders}
        loading={loading}
        onRefresh={refreshOrders}
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
