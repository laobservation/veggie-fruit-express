
import { useCallback } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { 
  deleteOrder as deleteOrderService,
  updateOrderStatus as updateOrderStatusService
} from '@/services/orderService';
import { generateOrderPDF } from '@/utils/pdfUtils';

export const useOrdersOperations = (
  orders: Order[],
  setOrders: (orders: Order[]) => void,
  selectedOrder: Order | null,
  setSelectedOrder: (order: Order | null) => void,
  setViewDialogOpen: (open: boolean) => void,
) => {
  const { toast } = useToast();

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }
    
    try {
      const success = await deleteOrderService(orderId);
      
      if (!success) {
        throw new Error('Failed to delete order');
      }
      
      // Update the UI after confirmation of deletion
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      // Close the dialog if the deleted order was being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setViewDialogOpen(false);
        setSelectedOrder(null);
      }
      
      toast({
        title: "Succès",
        description: "La commande a été supprimée avec succès.",
      });
    } catch (err) {
      console.error("Error deleting order:", err);
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
      await updateOrderStatusService(orderId, status as OrderStatus);

      toast({
        title: "Succès",
        description: `Le statut de la commande a été mis à jour.`,
      });
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: status as OrderStatus } : order
      ));
      
      // Update the selected order if it's the one being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: status as OrderStatus });
      }
    } catch (err) {
      console.error("Error updating status:", err);
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

  return {
    handleViewOrder,
    handleDeleteOrder,
    handleUpdateStatus,
    handleGeneratePDF
  };
};
