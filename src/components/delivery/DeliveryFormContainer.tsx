
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { submitOrderToSupabase } from './delivery-utils';
import CustomerInfoFields from './CustomerInfoFields';
import DeliveryTimeFields from './DeliveryTimeFields';

interface DeliveryFormContainerProps {
  onClose: () => void;
}

export type FormValues = {
  name: string;
  address: string;
  phone: string;
  preferDeliveryTime: boolean;
  deliveryTime?: string;
};

const DeliveryFormContainer: React.FC<DeliveryFormContainerProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      preferDeliveryTime: false,
      deliveryTime: 'matin',
    },
  });

  const preferDeliveryTime = form.watch('preferDeliveryTime');

  const onSubmit = async (data: FormValues) => {
    try {
      // Prepare order items data
      const itemsData = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Store order in Supabase
      const orderId = await submitOrderToSupabase(data, itemsData, getTotalPrice());
      
      if (!orderId) {
        toast.error("Une erreur s'est produite lors de l'enregistrement de la commande.");
        return;
      }

      // If successful, proceed with order confirmation
      const orderDetails = {
        orderId,
        name: data.name,
        address: data.address,
        phone: data.phone,
        preferredTime: data.preferDeliveryTime ? data.deliveryTime : '',
        totalAmount: getTotalPrice(),
        items: items,
        date: new Date().toISOString()
      };

      clearCart();
      toast.success("Commande enregistrée avec succès!");
      
      // Redirect to thank you page with order details and auto-download flag
      navigate('/thank-you', { 
        state: { 
          orderDetails,
          autoDownload: true
        } 
      });
    } catch (err) {
      console.error('Error processing order:', err);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomerInfoFields control={form.control} />
        <DeliveryTimeFields 
          control={form.control} 
          preferDeliveryTime={preferDeliveryTime} 
        />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-veggie-primary hover:bg-veggie-dark text-white"
          >
            Finaliser la commande
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DeliveryFormContainer;
