
import { FormValues, OrderData } from '@/types/delivery';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/hooks/use-cart';
import { Json } from '@/integrations/supabase/types';

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
    // Convert the cart items to a format compatible with Json type
    const orderItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      unit: item.product.unit,
      // Convert services to a simpler format that fits Json type
      services: item.selectedServices ? 
        item.selectedServices.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price
        })) : []
    }));

    // Convert phone to number if possible, otherwise pass as string
    // Since the database expects a number for Phone field
    let phoneNumber: number | null = null;
    if (formData.phone) {
      // Remove any non-digit characters
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly) {
        phoneNumber = parseInt(digitsOnly, 10);
        // If parsing fails, keep as null
        if (isNaN(phoneNumber)) {
          phoneNumber = null;
        }
      }
    }

    const insertData = {
      "Client Name": orderData.clientName,
      "Adresse": orderData.address,
      "Phone": phoneNumber, // Converted to number or null if invalid
      order_items: orderItems as unknown as Json,
      preferred_time: preferredTime,
      delivery_day: orderData.deliveryDay,
      subtotal: subtotal,
      shipping_cost: shippingCost,
      total_amount: orderData.totalAmount
    };
    
    const { data, error } = await supabase
      .from('Orders')
      .insert(insertData);
    
    if (error) {
      console.error('Error saving order:', error);
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
