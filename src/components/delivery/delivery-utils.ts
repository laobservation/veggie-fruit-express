
import { supabase } from '@/integrations/supabase/client';
import { FormValues } from './DeliveryFormContainer';
import { convertOrderItemsToJson } from '@/services/order';

interface OrderItem {
  productId: number | string;
  productName: string;
  quantity: number;
  price: number;
}

export const submitOrderToSupabase = async (
  formData: FormValues,
  orderItems: OrderItem[],
  totalAmount: number
): Promise<number | null> => {
  try {
    const { data: orderData, error } = await supabase
      .from('Orders')
      .insert({
        'Client Name': formData.name,
        'Adresse': formData.address,
        'Phone': parseInt(formData.phone, 10) || null, // Convert to number or null if invalid
        'order_items': convertOrderItemsToJson(orderItems), // Use the converter function
        'total_amount': totalAmount,
        'preferred_time': formData.preferDeliveryTime ? formData.deliveryTime : null,
        'status': 'new',
        'notified': false
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing order:', error);
      return null;
    }

    return orderData?.id || null;
  } catch (error) {
    console.error('Error submitting order:', error);
    return null;
  }
};
