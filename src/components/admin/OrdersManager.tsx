
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
    setViewDialogOpen,
    refreshOrders
  } = useOrders();

  // Force refresh on component mount and set up polling with performance optimization
  useEffect(() => {
    // Immediate refresh when component mounts
    refreshOrders();
    
    // Set up more frequent polling for new orders
    const intervalId = setInterval(() => {
      // Only poll when the document is visible to save resources
      if (document.visibilityState === 'visible') {
        refreshOrders();
      }
    }, 60000); // Poll every minute
    
    // Add visibility change listener to pause/resume polling
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshOrders();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshOrders]);

  // Memoize callbacks for better performance
  const handleCloseDialog = React.useCallback(() => {
    setViewDialogOpen(false);
  }, [setViewDialogOpen]);

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
        onClose={handleCloseDialog}
        order={selectedOrder}
        onDelete={handleDeleteOrder}
        onGeneratePDF={handleGeneratePDF}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrdersManager;
