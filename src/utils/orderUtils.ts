
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
    // Prepare items data for Supabase
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
    
    // Add retry logic for better reliability
    let retries = 3;
    let orderData = null;
    let error = null;
    
    while (retries > 0 && !orderData) {
      // Store order in Supabase
      const result = await supabase
        .from('Orders')
        .insert({
          'Client Name': data.name,
          'Adresse': data.address,
          'Phone': parseInt(data.phone, 10) || null,
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
        break;
      } else {
        error = result.error;
        retries--;
        if (retries > 0) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (4 - retries) * 500));
        }
      }
    }

    if (error || !orderData) {
      console.error('Error storing order:', error);
      toast.error("Une erreur s'est produite lors de l'enregistrement de la commande.");
    } else if (orderData?.id) {
      // Update orderDetails with the order ID if available
      orderDetails.orderId = orderData.id;
      console.log(`Order successfully created with ID: ${orderData.id}`);
      toast.success("Commande enregistrée avec succès");
    }
  } catch (err) {
    console.error('Error processing order:', err);
    toast.error("Une erreur s'est produite lors du traitement de la commande.");
  }

  return orderDetails;
};
