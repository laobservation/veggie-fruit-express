
import React, { useRef, useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import DeliveryDetails from './DeliveryDetails';
import OrderSummary from './OrderSummary';
import ActionButtons from './ActionButtons';

interface OrderDetails {
  name: string;
  address: string;
  phone: string;
  preferredTime?: string;
  deliveryDay?: string;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  items: any[];
  orderId?: string;
}

interface OrderConfirmationProps {
  orderDetails: OrderDetails;
  onGeneratePDF: () => void;
  currency: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderDetails, 
  onGeneratePDF,
  currency
}) => {
  const orderContentRef = useRef<HTMLDivElement>(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  
  // Set PDF as generated after a delay to match the auto-download
  useEffect(() => {
    const timer = setTimeout(() => {
      setPdfGenerated(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGeneratePDF = () => {
    onGeneratePDF();
    setPdfGenerated(true);
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-veggie-primary rounded-full p-3">
          <Check className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Merci pour votre commande !</h1>
      <p className="text-center text-gray-600 mb-8">
        Votre commande a été reçue et sera livrée bientôt.
      </p>
      
      <div ref={orderContentRef}>
        <DeliveryDetails 
          name={orderDetails.name}
          address={orderDetails.address}
          phone={orderDetails.phone}
          preferredTime={orderDetails.preferredTime}
          deliveryDay={orderDetails.deliveryDay}
        />
        
        <OrderSummary 
          items={orderDetails.items}
          subtotal={orderDetails.subtotal}
          shippingCost={orderDetails.shippingCost}
          totalAmount={orderDetails.totalAmount}
          currency={currency}
        />
      </div>
      
      <ActionButtons onGeneratePDF={handleGeneratePDF} pdfGenerated={pdfGenerated} />
    </div>
  );
};

export default OrderConfirmation;
