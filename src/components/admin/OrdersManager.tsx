
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

  // Force refresh on component mount and set up polling
  useEffect(() => {
    // Immediate refresh when component mounts
    refreshOrders();
    
    // Set up more frequent polling for new orders
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 60000); // Poll every minute
    
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
