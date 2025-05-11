
import { useState } from 'react';
import { Order } from '@/types/order';

export const useOrdersState = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return {
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
  };
};
