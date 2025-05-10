
import React, { useCallback, useEffect } from 'react';
import { OrdersList } from './orders/OrdersList';
import { OrderDetailsDialog } from './orders/OrderDetailsDialog';
import { useOrders } from '@/hooks/use-orders';
import { toast } from 'sonner';

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
    setViewDialogOpen
  } = useOrders();

  // Enhanced refresh function with error handling and user feedback
  const refreshOrders = useCallback(async () => {
    try {
      await fetchOrders();
      toast.success("Liste des commandes mise à jour");
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast.error("Erreur lors de la mise à jour des commandes");
    }
  }, [fetchOrders]);

  // Force refresh on component mount and set up polling
  useEffect(() => {
    // Immediate refresh when component mounts
    refreshOrders();
    
    // Set up more frequent polling for new orders
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 60000); // Poll every minute instead of two minutes
    
    return () => clearInterval(intervalId);
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
