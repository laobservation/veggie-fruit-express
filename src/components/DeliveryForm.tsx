
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
      // Show processing toast
      const loadingToast = toast.loading("Traitement de votre commande...");
      
      // Process the order and get order details for thank you page
      const orderDetails = await processOrder(data, items, getTotalPrice, getShippingCost);
      
      // Clear the loading toast
      toast.dismiss(loadingToast);
      
      // Success toast
      toast.success("Commande enregistrée avec succès!");
      
      // Close the form/cart panel
      onClose();
      
      // Clear the cart after the order is processed
      clearCart();
      
      console.log("Redirecting to thank-you page with order details:", orderDetails);
      
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        // Redirect to thank you page with order details
        navigate('/thank-you', { 
          state: { orderDetails },
          replace: true // Replace current history entry to prevent back navigation
        });
      }, 100);
      
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
