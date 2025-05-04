
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw, Eye, Download, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Json } from '@/integrations/supabase/types';
import { formatPrice } from '@/lib/formatPrice';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  'Client Name': string;
  'Adresse': string;
  'Phone': number | null;
  order_items?: OrderItem[];
  total_amount?: number;
  preferred_time?: string | null;
  status?: string;
  notified?: boolean;
  created_at: string;
}

// Type for raw order data from Supabase
interface RawOrder {
  id: number;
  'Client Name': string | null;
  'Adresse': string | null;
  'Phone': number | null;
  order_items?: Json;
  total_amount?: number | null;
  preferred_time?: string | null;
  status?: string | null;
  notified?: boolean | null;
  created_at: string;
}

const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .order('created_at', { ascending: false });

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
          // Refresh the orders to ensure UI is in sync
          fetchOrders();
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('Orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la commande.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "La commande a été supprimée avec succès.",
      });
      
      // Remove the deleted order from the local state
      setOrders(orders.filter(order => order.id !== orderId));
      
      // Close the dialog if the deleted order was being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setViewDialogOpen(false);
      }
    } catch (err) {
      console.error('Error in deleting order:', err);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        description: `Le statut de la commande a été mis à jour en "${status}".`,
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

  const generateOrderPDF = (order: Order) => {
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.setTextColor(39, 174, 96);
    doc.text("Marché Bio", 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Détails de la Commande #" + order.id, 105, 30, { align: 'center' });
    
    // Customer information
    doc.setFontSize(12);
    doc.text("Informations Client", 20, 45);
    doc.setFontSize(10);
    doc.text(`Nom: ${order['Client Name']}`, 20, 55);
    doc.text(`Adresse: ${order['Adresse']}`, 20, 60);
    doc.text(`Téléphone: ${order['Phone'] || 'Non fourni'}`, 20, 65);
    doc.text(`Date: ${formatDate(order.created_at)}`, 20, 70);
    if (order.preferred_time) {
      doc.text(`Heure de livraison préférée: ${order.preferred_time}`, 20, 75);
    }
    
    // Status
    doc.text(`Statut: ${order.status || 'Nouveau'}`, 20, order.preferred_time ? 80 : 75);
    
    // Items table
    const tableColumn = ["Produit", "Quantité", "Prix unitaire", "Total"];
    const tableRows: any[] = [];
    
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach(item => {
        const itemData = [
          item.productName,
          item.quantity,
          formatPrice(item.price),
          formatPrice(item.price * item.quantity)
        ];
        tableRows.push(itemData);
      });
    }
    
    // Use autoTable correctly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      theme: 'striped',
      headStyles: { fillColor: [39, 174, 96] }
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(order.total_amount || 0)}`, 150, finalY + 15);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Document généré le " + new Date().toLocaleString('fr-FR'), 20, finalY + 30);
    
    // Save PDF
    doc.save(`commande-${order.id}.pdf`);
    
    toast({
      title: "PDF généré",
      description: `La commande #${order.id} a été téléchargée en PDF.`
    });
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'processing':
        return <Badge className="bg-blue-500">En traitement</Badge>;
      case 'shipped':
        return <Badge className="bg-orange-500">Expédiée</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Livrée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge className="bg-gray-500">Nouvelle</Badge>;
    }
  };

  const statusOptions = [
    { value: 'new', label: 'Nouvelle', color: 'bg-gray-500' },
    { value: 'processing', label: 'En traitement', color: 'bg-blue-500' },
    { value: 'shipped', label: 'Expédiée', color: 'bg-orange-500' },
    { value: 'delivered', label: 'Livrée', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Annulée', color: 'bg-red-500' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des Commandes</h2>
        <Button 
          onClick={fetchOrders} 
          variant="outline" 
          className="flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          {loading ? 'Chargement des commandes...' : 'Aucune commande trouvée.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order['Client Name']}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{order['Adresse']}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                            <span className="sr-only">Changer le statut</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                            >
                              <path
                                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {statusOptions.map(option => (
                            <DropdownMenuItem 
                              key={option.value}
                              onClick={() => handleUpdateStatus(order.id, option.value)}
                              className="flex items-center gap-2"
                            >
                              <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                              {option.label}
                              {order.status === option.value && <Check className="h-4 w-4 ml-1" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(order.total_amount || 0)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateOrderPDF(order)}
                        title="Télécharger PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la Commande #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Informations Client</h3>
                  <p><span className="font-medium">Nom:</span> {selectedOrder['Client Name']}</p>
                  <p><span className="font-medium">Adresse:</span> {selectedOrder['Adresse']}</p>
                  <p><span className="font-medium">Téléphone:</span> {selectedOrder['Phone'] || 'Non fourni'}</p>
                  {selectedOrder.preferred_time && (
                    <p><span className="font-medium">Livraison préférée:</span> {selectedOrder.preferred_time}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Détails de la Commande</h3>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.created_at)}</p>
                  <p>
                    <span className="font-medium">Statut:</span> {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p><span className="font-medium">Total:</span> {formatPrice(selectedOrder.total_amount || 0)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Produits</h3>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead className="text-center">Quantité</TableHead>
                          <TableHead className="text-right">Prix</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.order_items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun détail de produit disponible.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Mettre à jour le statut</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(option => (
                    <Button 
                      key={option.value}
                      size="sm" 
                      variant={selectedOrder.status === option.value ? 'default' : 'outline'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, option.value)}
                      className={selectedOrder.status === option.value ? option.color : ''}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => generateOrderPDF(selectedOrder)}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManager;
