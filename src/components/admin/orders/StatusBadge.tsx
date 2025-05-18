
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const [badgeClass, setBadgeClass] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("");
  
  useEffect(() => {
    // Dynamically update the badge style and text based on status
    switch(status) {
      case 'processing':
        setBadgeClass("bg-blue-500");
        setStatusText("En traitement");
        break;
      case 'shipped':
        setBadgeClass("bg-orange-500");
        setStatusText("Expédiée");
        break;
      case 'delivered':
        setBadgeClass("bg-green-500");
        setStatusText("Livrée");
        break;
      case 'cancelled':
        setBadgeClass("bg-red-500");
        setStatusText("Annulée");
        break;
      default:
        setBadgeClass("bg-gray-500");
        setStatusText("Nouvelle");
        break;
    }
  }, [status]);
  
  return <Badge className={badgeClass}>{statusText}</Badge>;
};
