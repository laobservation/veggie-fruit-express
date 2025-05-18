
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Get the appropriate styling based on status
  const getStatusStyle = () => {
    switch(status) {
      case 'processing':
        return "bg-blue-500 hover:bg-blue-600";
      case 'shipped':
        return "bg-orange-500 hover:bg-orange-600";
      case 'delivered':
        return "bg-green-500 hover:bg-green-600";
      case 'cancelled':
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Get the display text based on status
  const getStatusText = () => {
    switch(status) {
      case 'processing':
        return "En traitement";
      case 'shipped':
        return "Expédiée";
      case 'delivered':
        return "Livrée";
      case 'cancelled':
        return "Annulée";
      default:
        return "Nouvelle";
    }
  };

  return (
    <Badge className={`${getStatusStyle()} transition-colors duration-200`}>
      {getStatusText()}
    </Badge>
  );
};
