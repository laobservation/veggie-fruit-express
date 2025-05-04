
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, Download, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { Order } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { StatusDropdown } from './StatusDropdown';
import { formatDate } from '@/utils/formatUtils';

interface OrderCardProps {
  order: Order;
  onView: (order: Order) => void;
  onDelete: (orderId: number) => void;
  onUpdateStatus: (orderId: number, status: string) => void;
  onGeneratePDF: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onView, 
  onDelete, 
  onUpdateStatus,
  onGeneratePDF 
}) => {
  return (
    <TableRow key={order.id}>
      <TableCell>#{order.id}</TableCell>
      <TableCell>{order['Client Name']}</TableCell>
      <TableCell className="truncate max-w-[200px]">{order['Adresse']}</TableCell>
      <TableCell>{formatDate(order.created_at)}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <StatusBadge status={order.status} />
          <StatusDropdown 
            currentStatus={order.status} 
            onStatusChange={(status) => onUpdateStatus(order.id, status)} 
          />
        </div>
      </TableCell>
      <TableCell>{formatPrice(order.total_amount || 0)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(order)}
            title="Voir les détails"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGeneratePDF(order)}
            title="Télécharger PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(order.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
