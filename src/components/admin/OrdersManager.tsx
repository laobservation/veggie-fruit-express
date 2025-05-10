
import React, { useCallback } from 'react';
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
  const refreshOrders = useCallback(() => {
    try {
      fetchOrders();
      toast.success("Liste des commandes mise à jour");
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast.error("Erreur lors de la mise à jour des commandes");
    }
  }, [fetchOrders]);

  // Force refresh on component mount with improved error handling
  React.useEffect(() => {
    refreshOrders();
    
    // Set up polling for new orders every 2 minutes
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 120000); // 2 minutes
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
