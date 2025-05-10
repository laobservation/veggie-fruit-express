
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
import { useSettings } from '@/hooks/use-settings';

interface DeliveryFormProps {
  onClose: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getShippingCost, clearCart } = useCart();
  const { settings } = useSettings();
  
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
      // Process the order and get order details for thank you page
      const orderDetails = await processOrder(data, items, getTotalPrice, getShippingCost);
      
      // Close the form/cart panel immediately to ensure it's not visible
      onClose();
      
      // Clear the cart after the order is processed
      clearCart();
      
      // Redirect to thank you page with order details
      navigate('/thank-you', { state: { orderDetails } });
    } catch (err) {
      console.error('Error processing order:', err);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  // Calculate totals
  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const totalAmount = subtotal + shippingCost;

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomerInfoFields />
          
          <DeliveryTimeSelector />
          
          {/* Order Summary with Shipping Fee */}
          <div className="border-t pt-4 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>{subtotal.toFixed(2)} {settings.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de livraison:</span>
                <span>{shippingCost.toFixed(2)} {settings.currency}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{totalAmount.toFixed(2)} {settings.currency}</span>
              </div>
            </div>
          </div>
          
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
