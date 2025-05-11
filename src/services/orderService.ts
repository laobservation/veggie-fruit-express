
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, OrderStatus, RawOrder } from '@/types/order';
import { Json } from '@/integrations/supabase/types';

// Helper function to convert OrderItem[] to Json for Supabase storage
const convertOrderItemsToJson = (items: OrderItem[]): Json => {
  return items as unknown as Json;
};

// Helper function to convert Json to OrderItem[] from Supabase retrieval
const convertJsonToOrderItems = (json: Json | null): OrderItem[] => {
  if (!json || !Array.isArray(json)) {
    console.warn("Invalid order items data:", json);
    return [];
  }
  
  try {
    // Type assertion to handle Json elements as record objects
    return json.map((item: any) => ({
      productId: Number(item?.productId || 0),
      productName: String(item?.productName || ''),
      quantity: Number(item?.quantity || 0),
      price: Number(item?.price || 0),
      services: Array.isArray(item?.services) ? item.services : []
    }));
  } catch (error) {
    console.error("Error converting JSON to order items:", error, json);
    return [];
  }
};

// Transform raw order data from Supabase to our application's Order type
export const transformRawOrder = (rawOrder: RawOrder): Order => {
  console.log("Transforming raw order:", rawOrder);
  
  return {
    id: rawOrder.id,
    'Client Name': rawOrder['Client Name'] || '',
    'Adresse': rawOrder.Adresse || '',
    'Phone': rawOrder.Phone,
    order_items: convertJsonToOrderItems(rawOrder.order_items),
    total_amount: rawOrder.total_amount || 0,
    subtotal: rawOrder.subtotal || 0,
    shipping_cost: rawOrder.shipping_cost || 0,
    preferred_time: rawOrder.preferred_time,
    status: (rawOrder.status as OrderStatus) || 'new',
    notified: rawOrder.notified || false,
    created_at: rawOrder.created_at
  };
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

// Delete an order - Using Edge Function
export const deleteOrder = async (orderId: number): Promise<boolean> => {
  try {
    console.log('Attempting to delete order:', orderId);
    
    const { data, error } = await supabase.functions.invoke('delete_order_by_id', {
      body: { order_id: orderId }
    });

    if (error) {
      console.error('Error invoking delete_order_by_id function:', error);
      return false;
    }

    console.log('Edge function response:', data);
    
    // Check if the edge function was successful
    if (data && data.success) {
      console.log('Order deleted successfully');
      return true;
    } else {
      console.error('Edge function did not return success:', data);
      return false;
    }
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

// Fetch paginated orders
export const fetchPaginatedOrders = async (page: number, pageSize: number): Promise<{ orders: RawOrder[], totalPages: number }> => {
  try {
    // Calculate start and end indices for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('Orders')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting orders:', countError);
      return { orders: [], totalPages: 0 };
    }

    // Fetch paginated orders
    const { data: orders, error } = await supabase
      .from('Orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching paginated orders:', error);
      return { orders: [], totalPages: 0 };
    }

    console.log('Raw orders from database:', orders);

    // Calculate total pages
    const totalPages = Math.ceil((count || 0) / pageSize);

    return {
      orders: orders as RawOrder[],
      totalPages
    };
  } catch (error) {
    console.error('Paginated orders fetch failed:', error);
    return { orders: [], totalPages: 0 };
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
