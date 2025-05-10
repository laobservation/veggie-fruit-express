
import React from 'react';
import { formatPrice } from '@/lib/formatPrice';

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  currency?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  subtotal,
  shippingCost,
  totalAmount,
  currency = 'DH'
}) => {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3">Résumé de la commande :</h2>
      {items && items.map((item, index) => (
        <div key={index} className="flex justify-between py-2 border-b">
          <span>{item.product.name} × {item.quantity}</span>
          <span>{formatPrice(item.product.price * item.quantity)}</span>
        </div>
      ))}
      
      <div className="flex justify-between mt-2 text-gray-600">
        <span>Sous-total :</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      
      <div className="flex justify-between mt-1 text-gray-600">
        <span>Frais de livraison :</span>
        <span>{formatPrice(shippingCost)}</span>
      </div>
      
      <div className="flex justify-between font-bold mt-2 pt-2 border-t">
        <span>Total :</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      
      <div className="text-right text-xs text-gray-500 mt-1">
        (Tous les prix sont en {currency})
      </div>
    </div>
  );
};

export default OrderSummary;
