
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { FormValues } from '@/types/delivery';
import { processOrder } from '@/utils/orderUtils';
import CustomerInfoFields from './delivery/CustomerInfoFields';
import DeliveryTimeSelector from './delivery/DeliveryTimeSelector';

interface DeliveryFormProps {
  onClose: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getShippingCost, clearCart } = useCart();
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      preferDeliveryTime: false,
      deliveryTime: 'matin',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Close the form/cart panel immediately to ensure it's not visible
      onClose();
      
      // Process the order and get order details for thank you page
      const orderDetails = await processOrder(data, items, getTotalPrice, getShippingCost);
      
      // First redirect to thank you page for immediate visual feedback
      navigate('/thank-you', { state: { orderDetails } });
      
      // Clear the cart after the order is processed
      clearCart();
    } catch (err) {
      console.error('Error processing order:', err);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomerInfoFields />
          
          <DeliveryTimeSelector />
          
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
    </FormProvider>
  );
};

export default DeliveryForm;
