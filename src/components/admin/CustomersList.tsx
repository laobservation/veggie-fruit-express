
import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  orders: number;
  total: number;
  lastOrder: string;
}

const CustomersList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Get all orders
      const { data: orders, error } = await supabase
        .from('Orders')
        .select('id, "Client Name", Phone, total_amount, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process orders to extract unique customers
      const customerMap = new Map<string, Customer>();
      
      orders?.forEach(order => {
        const name = order['Client Name'];
        if (!name) return;
        
        const phone = order.Phone?.toString();
        
        if (customerMap.has(name)) {
          // Update existing customer data
          const customer = customerMap.get(name)!;
          customer.orders += 1;
          customer.total += order.total_amount || 0;
          // We don't update lastOrder as we've sorted by created_at descending
        } else {
          // Create new customer entry
          customerMap.set(name, {
            id: Math.random().toString(36).substr(2, 9),  // Generate random ID
            name,
            phone,
            orders: 1,
            total: order.total_amount || 0,
            lastOrder: new Date(order.created_at).toLocaleDateString(),
          });
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      // Get orders for this customer
      const { data: customerOrders, error: fetchError } = await supabase
        .from('Orders')
        .select('id')
        .eq('Client Name', customerToDelete.name);
      
      if (fetchError) throw fetchError;
      
      if (customerOrders && customerOrders.length > 0) {
        // Delete orders one by one
        for (const order of customerOrders) {
          const { error: deleteError } = await supabase
            .from('Orders')
            .delete()
            .eq('id', order.id);
          
          if (deleteError) throw deleteError;
        }
      }
      
      // Remove from local state after successful deletion
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      
      toast({
        title: "Succès",
        description: `Le client ${customerToDelete.name} et ses commandes ont été supprimés`,
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (customer.phone && customer.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Clients</CardTitle>
          <CardDescription>Gérez votre liste de clients et consultez leurs commandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Total dépensé</TableHead>
                  <TableHead>Dernière commande</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Chargement des clients...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone || "Non spécifié"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.orders}</Badge>
                      </TableCell>
                      <TableCell>{customer.total.toFixed(2)}€</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir les commandes</DropdownMenuItem>
                            <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCustomer(customer)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer le client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client et toutes ses commandes ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomersList;
