
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
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalAmount }) => {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3">Résumé de la commande :</h2>
      {items && items.map((item, index) => (
        <div key={index} className="flex justify-between py-2 border-b">
          <span>{item.product.name} × {item.quantity}</span>
          <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="flex justify-between font-bold mt-2">
        <span>Total :</span>
        <span>€{totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
