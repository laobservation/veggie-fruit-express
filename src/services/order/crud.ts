
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, RawOrder } from '@/types/order';
import { convertOrderItemsToJson, transformRawOrder } from './converters';

// Create a new order
export const createOrder = async (orderData: Partial<Order>): Promise<number | null> => {
  try {
    // Transform order items to raw JSON for storage
    const rawOrderData = {
      'Client Name': orderData['Client Name'],
      'Adresse': orderData['Adresse'],
      'Phone': orderData['Phone'],
      order_items: convertOrderItemsToJson(orderData.order_items || []),
      total_amount: orderData.total_amount,
      preferred_time: orderData.preferred_time,
      status: orderData.status || 'new',
      notified: orderData.notified || false
    };

    // Insert the order into Supabase
    const { data, error } = await supabase
      .from('Orders')
      .insert(rawOrderData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    // Return the new order ID
    return data?.id || null;
  } catch (error) {
    console.error('Order creation failed:', error);
    return null;
  }
};

// Get a single order by ID
export const getOrderById = async (orderId: number): Promise<Order | null> => {
  try {
    const { data: order, error } = await supabase
      .from('Orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return transformRawOrder(order as RawOrder);
  } catch (error) {
    console.error('Order fetch failed:', error);
    return null;
  }
};

// Delete an order 
export const deleteOrder = async (orderId: number): Promise<boolean> => {
  try {
    console.log('Attempting to delete order:', orderId);
    
    // First attempt: Try direct deletion
    const { error } = await supabase
      .from('Orders')
      .delete()
      .eq('id', orderId);

    if (!error) {
      console.log('Order deleted successfully');
      return true;
    }

    console.error('Error deleting order on first attempt:', error);
    
    // If we have an error, log the detailed error info
    console.error('Error deleting order:', error);
    return false;
  } catch (error) {
    console.error('Order deletion failed:', error);
    return false;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: number, status: OrderStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Order status update failed:', error);
    return false;
  }
};

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('Orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return (orders as RawOrder[]).map(transformRawOrder);
  } catch (error) {
    console.error('Orders fetch failed:', error);
    return [];
  }
};

// Update order notification status
export const updateOrderNotification = async (orderId: number, notified: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Orders')
      .update({ notified })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order notification status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Order notification update failed:', error);
    return false;
  }
};
