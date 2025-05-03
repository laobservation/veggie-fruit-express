
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Order {
  id: number;
  'Client Name': string;
  'Adresse': string;
  'Phone': number | null;
  created_at: string;
}

const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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

      // Ensure the data matches our Order interface
      setOrders(data as Order[]);
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
  }, []);

  const handleDeleteOrder = async (orderId: number) => {
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
      
      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      console.error('Error in deleting order:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la commande.",
        variant: "destructive",
      });
    }
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order['Client Name']}</TableCell>
                <TableCell>{order['Adresse']}</TableCell>
                <TableCell>{order['Phone']}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrdersManager;
