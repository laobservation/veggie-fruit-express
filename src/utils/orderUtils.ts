
import { FormValues, OrderData } from '@/types/delivery';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/hooks/use-cart';

export async function processOrder(
  formData: FormValues,
  cartItems: CartItem[],
  getSubtotal: () => number,
  getShippingCost: () => number
): Promise<OrderData> {
  // Create order data object
  const preferredTime = formData.preferDeliveryTime ? formData.deliveryTime : 'any';
  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  
  const orderData: OrderData = {
    clientName: formData.name,
    address: formData.address,
    phone: formData.phone,
    items: cartItems,
    preferredTime,
    deliveryDay: formData.deliveryDay || 'today',
    subtotal,
    shippingCost,
    totalAmount: subtotal + shippingCost
  };
  
  // Save order to database
  try {
    const { data, error } = await supabase
      .from('Orders')
      .insert({
        'Client Name': orderData.clientName,
        'Adresse': orderData.address,
        'Phone': orderData.phone,
        'order_items': cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          unit: item.product.unit,
          services: item.selectedServices || []
        })),
        'preferred_time': preferredTime,
        'delivery_day': orderData.deliveryDay,
        'subtotal': subtotal,
        'shipping_cost': shippingCost,
        'total_amount': orderData.totalAmount
      });
    
    if (error) {
      throw error;
    }
    
    console.log('Order saved successfully:', data);
    
    // Return the order data for thank you page, etc.
    return orderData;
  } catch (error) {
    console.error('Error saving order:', error);
    throw new Error('Failed to save order to database');
  }
}
