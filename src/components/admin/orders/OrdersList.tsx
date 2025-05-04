
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Order } from '@/types/order';
import { OrderCard } from './OrderCard';

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onView: (order: Order) => void;
  onDelete: (orderId: number) => void;
  onUpdateStatus: (orderId: number, status: string) => void;
  onGeneratePDF: (order: Order) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  loading,
  onRefresh,
  onView,
  onDelete,
  onUpdateStatus,
  onGeneratePDF
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des Commandes</h2>
        <Button 
          onClick={onRefresh} 
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
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={onView}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                  onGeneratePDF={onGeneratePDF}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
