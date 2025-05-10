
import { supabase } from '@/integrations/supabase/client';
import { FormValues, OrderDetails } from '@/types/delivery';
import { CartItem } from '@/hooks/use-cart';
import { toast } from 'sonner';

export const processOrder = async (
  data: FormValues,
  items: CartItem[],
  getTotalPrice: () => number,
  getShippingCost: () => number
): Promise<OrderDetails> => {
  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const totalAmount = subtotal + shippingCost;

  // Create order details object for thank you page with proper typing
  const orderDetails: OrderDetails = {
    name: data.name,
    address: data.address,
    phone: data.phone,
    preferredTime: data.preferDeliveryTime ? data.deliveryTime : '',
    totalAmount: totalAmount,
    subtotal: subtotal,
    shippingCost: shippingCost,
    items: items,
    date: new Date().toISOString()
  };

  try {
    // Prepare items data for Supabase with additional validation
    const itemsData = items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      services: item.selectedServices ? item.selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price
      })) : []
    }));
    
    // Improved retry logic with exponential backoff
    let retries = 5; // Increase max retries
    let orderData = null;
    let error = null;
    let backoffDelay = 500; // Start with 500ms delay
    
    while (retries > 0 && !orderData) {
      console.log(`Attempting to store order, retry ${6 - retries}/5`);
      
      // Store order in Supabase with validation
      const result = await supabase
        .from('Orders')
        .insert({
          'Client Name': data.name.trim(),
          'Adresse': data.address.trim(),
          'Phone': parseInt(data.phone.replace(/\D/g, ''), 10) || null,
          'order_items': itemsData,
          'total_amount': totalAmount,
          'shipping_cost': shippingCost,
          'subtotal': subtotal,
          'preferred_time': data.preferDeliveryTime ? data.deliveryTime : null,
          'status': 'new',
          'notified': false
        })
        .select('id')
        .single();
        
      if (!result.error && result.data) {
        orderData = result.data;
        console.log(`Order successfully created with ID: ${orderData.id}`);
        break;
      } else {
        error = result.error;
        console.error(`Error attempt ${6 - retries}: `, error);
        retries--;
        
        if (retries > 0) {
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          backoffDelay *= 2; // Double the delay for next retry
        }
      }
    }

    if (error || !orderData) {
      console.error('Error storing order after all retries:', error);
      toast.error("Une erreur s'est produite lors de l'enregistrement de la commande. Veuillez réessayer.");
      throw new Error('Failed to store order');
    } else if (orderData?.id) {
      // Update orderDetails with the order ID if available
      orderDetails.orderId = orderData.id;
      toast.success("Commande enregistrée avec succès");
    }
  } catch (err) {
    console.error('Error processing order:', err);
    toast.error("Une erreur s'est produite lors du traitement de la commande. Veuillez réessayer.");
    throw err; // Re-throw to allow handling in calling component
  }

  return orderDetails;
};
