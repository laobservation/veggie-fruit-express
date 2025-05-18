
import { useCallback } from 'react';
import { useOrdersState } from './orders/use-orders-state';
import { useOrdersFetch } from './orders/use-orders-fetch';
import { useOrdersOperations } from './orders/use-orders-operations';
import { useOrdersPagination } from './orders/use-orders-pagination';
import { toast } from 'sonner';

export const useOrders = () => {
  const {
    orders,
    setOrders,
    loading,
    setLoading,
    selectedOrder,
    setSelectedOrder,
    viewDialogOpen,
    setViewDialogOpen,
    page,
    setPage,
    totalPages,
    setTotalPages
  } = useOrdersState();

  const { fetchOrders } = useOrdersFetch({
    page,
    setLoading,
    setOrders,
    setTotalPages,
    selectedOrder,
    setViewDialogOpen,
    setSelectedOrder,
  });

  const {
    handleViewOrder,
    handleDeleteOrder,
    handleUpdateStatus,
    handleGeneratePDF
  } = useOrdersOperations(
    orders,
    setOrders,
    selectedOrder,
    setSelectedOrder,
    setViewDialogOpen
  );

  const { handlePageChange } = useOrdersPagination(setPage);

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
    setViewDialogOpen,
    refreshOrders
  };
};
