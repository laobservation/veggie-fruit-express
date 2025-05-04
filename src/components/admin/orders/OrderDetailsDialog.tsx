
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { Order, statusOptions } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/utils/formatUtils';

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onDelete: (orderId: number) => void;
  onGeneratePDF: (order: Order) => void;
  onUpdateStatus: (orderId: number, status: string) => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onClose,
  order,
  onDelete,
  onGeneratePDF,
  onUpdateStatus
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la Commande #{order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Informations Client</h3>
              <p><span className="font-medium">Nom:</span> {order['Client Name']}</p>
              <p><span className="font-medium">Adresse:</span> {order['Adresse']}</p>
              <p><span className="font-medium">Téléphone:</span> {order['Phone'] || 'Non fourni'}</p>
              {order.preferred_time && (
                <p><span className="font-medium">Livraison préférée:</span> {order.preferred_time}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-1">Détails de la Commande</h3>
              <p><span className="font-medium">Date:</span> {formatDate(order.created_at)}</p>
              <p>
                <span className="font-medium">Statut:</span> <StatusBadge status={order.status} />
              </p>
              <p><span className="font-medium">Total:</span> {formatPrice(order.total_amount || 0)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Produits</h3>
            {order.order_items && order.order_items.length > 0 ? (
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
                    {order.order_items.map((item, idx) => (
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
                  variant={order.status === option.value ? 'default' : 'outline'}
                  onClick={() => onUpdateStatus(order.id, option.value)}
                  className={order.status === option.value ? option.color : ''}
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
                onClick={() => onGeneratePDF(order)}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
              <Button
                variant="outline"
                className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => onDelete(order.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
