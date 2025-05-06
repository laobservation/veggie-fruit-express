
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DeliveryFormProps {
  onClose: () => void;
}

type FormValues = {
  name: string;
  address: string;
  phone: string;
  preferDeliveryTime: boolean;
  deliveryTime?: string;
};

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onClose }) => {
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
      // Close the form/cart panel immediately to create a cleaner transition
      onClose();
      
      // Prepare order items data
      const itemsData = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Store order in Supabase
      const { data: orderData, error } = await supabase
        .from('Orders')
        .insert({
          'Client Name': data.name,
          'Adresse': data.address,
          'Phone': parseInt(data.phone, 10) || null,
          'order_items': itemsData,
          'total_amount': getTotalPrice(),
          'preferred_time': data.preferDeliveryTime ? data.deliveryTime : null,
          'status': 'new',
          'notified': false
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error storing order:', error);
        toast.error("Une erreur s'est produite lors de l'enregistrement de la commande.");
        return;
      }

      // Create order details object for thank you page
      const orderDetails = {
        orderId: orderData?.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        preferredTime: data.preferDeliveryTime ? data.deliveryTime : '',
        totalAmount: getTotalPrice(),
        items: items,
        date: new Date().toISOString()
      };

      // Clear the cart
      clearCart();
      
      // Immediate redirect to thank you page with order details
      navigate('/thank-you', { state: { orderDetails } });
    } catch (err) {
      console.error('Error processing order:', err);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Votre adresse complète" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Votre numéro de téléphone" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferDeliveryTime"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Je préfère choisir une heure de livraison
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {preferDeliveryTime && (
          <FormField
            control={form.control}
            name="deliveryTime"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Heure de livraison préférée</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="matin" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Matin (8h - 12h)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="apres-midi" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Après-midi (13h - 17h)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="soir" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Soir (17h - 20h)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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

export default DeliveryForm;
