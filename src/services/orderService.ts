
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order, OrderItem, OrderStatus, RawOrder } from '@/types/order';
import { Json } from '@/integrations/supabase/types';
import { Product } from '@/types/product';

// Helper function to convert OrderItem[] to Json for Supabase storage
const convertOrderItemsToJson = (items: OrderItem[]): Json => {
  return items as unknown as Json;
};

// Helper function to convert Json to OrderItem[] from Supabase retrieval
const convertJsonToOrderItems = (json: Json | null): OrderItem[] => {
  if (!json || !Array.isArray(json)) {
    return [];
  }
  
  // Type assertion to handle Json elements as record objects
  return json.map((item: any) => ({
    productId: Number(item?.productId || 0),
    productName: String(item?.productName || ''),
    quantity: Number(item?.quantity || 0),
    price: Number(item?.price || 0)
  }));
};

// Helper function to fix product type imports for HomePage
export const fixProductImportType = (products: any[]): Product[] => {
  return products.map(product => ({
    ...product,
    id: String(product.id)
  }));
};

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

// Transform raw order data from Supabase to our application's Order type
export const transformRawOrder = (rawOrder: RawOrder): Order => {
  return {
    id: rawOrder.id,
    'Client Name': rawOrder['Client Name'] || '',
    'Adresse': rawOrder.Adresse || '',
    'Phone': rawOrder.Phone,
    order_items: convertJsonToOrderItems(rawOrder.order_items),
    total_amount: rawOrder.total_amount || 0,
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
