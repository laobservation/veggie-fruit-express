
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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
