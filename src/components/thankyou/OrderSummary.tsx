
import React from 'react';
import { formatPrice } from '@/lib/formatPrice';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  product: {
    name: string;
    price: number;
    unit: string;
  };
  quantity: number;
  selectedServices?: ServiceOption[];
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  subtotal, 
  shippingCost, 
  totalAmount,
  currency
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-3">Récapitulatif de la commande</h2>
        <p className="text-gray-500">Aucun article dans cette commande.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-3">Récapitulatif de la commande</h2>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{item.product.name}</div>
                      {/* Display selected services if any */}
                      {item.selectedServices && item.selectedServices.length > 0 && (
                        <div className="mt-1">
                          {item.selectedServices.map((service, sIndex) => (
                            <div key={sIndex} className="text-xs text-gray-500 mt-0.5 pl-2 border-l-2 border-gray-200">
                              + {service.name} ({formatPrice(service.price)} {currency})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    {formatPrice(item.product.price * item.quantity)} {currency}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Sous-total:</span>
          <span>{formatPrice(subtotal)} {currency}</span>
        </div>
        <div className="flex justify-between py-2 border-t border-gray-100">
          <span className="text-gray-600">Frais de livraison:</span>
          <span>{formatPrice(shippingCost)} {currency}</span>
        </div>
        <div className="flex justify-between py-2 border-t border-gray-100 font-medium">
          <span>Total:</span>
          <span>{formatPrice(totalAmount)} {currency}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
