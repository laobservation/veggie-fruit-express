
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
    
    console.log("Preparing to save order with data:", {
      client: data.name,
      address: data.address,
      phone: data.phone,
      items: itemsData,
      totals: { subtotal, shippingCost, totalAmount }
    });
    
    // Insert order into database with explicit column names to avoid any mismatch issues
    const { data: orderData, error } = await supabase
      .from('Orders')
      .insert({
        'Client Name': data.name.trim(),
        'Adresse': data.address.trim(),
        'Phone': data.phone ? parseInt(data.phone.replace(/\D/g, ''), 10) : null,
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
      
    if (error) {
      console.error('Error storing order:', error);
      throw new Error(`Failed to store order: ${error.message}`);
    }
    
    if (orderData?.id) {
      console.log(`Order successfully created with ID: ${orderData.id}`);
      // Update orderDetails with the order ID
      orderDetails.orderId = orderData.id;
    } else {
      console.warn('Order created but no ID was returned');
    }
    
  } catch (err) {
    console.error('Error processing order:', err);
    throw err; // Re-throw to allow handling in calling component
  }

  return orderDetails;
};
