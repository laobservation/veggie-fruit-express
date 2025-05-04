
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order, OrderItem, OrderStatus, RawOrder } from '@/types/order';

export const createOrder = async (orderData: Partial<Order>): Promise<number | null> => {
  try {
    // Create a new order record
    const { data: order, error: orderError } = await supabase
      .from('Orders')
      .insert([orderData])
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Erreur lors de la création de la commande: ${orderError.message}`);
    }

    return order.id;
  } catch (error) {
    console.error('Order creation failed:', error);
    toast.error("La création de la commande a échoué.");
    return null;
  }
};

export const addOrderItems = async (orderId: number, items: Omit<OrderItem, 'id' | 'order_id'>[]) => {
  try {
    // Add order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderId
    }));

    const { error: itemsError } = await supabase
      .from('OrderItems')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error adding order items:', itemsError);
      throw new Error(`Erreur lors de l'ajout des articles: ${itemsError.message}`);
    }

    return true;
  } catch (error) {
    console.error('Adding order items failed:', error);
    toast.error("L'ajout des articles a échoué.");
    return false;
  }
};

export const getOrderById = async (orderId: number) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('Orders')
      .select(`
        *,
        OrderItems (
          *,
          Products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return null;
    }

    return order;
  } catch (error) {
    console.error('Order fetch failed:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
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

export const deleteOrder = async (orderId: number) => {
  try {
    // First attempt: Try using the custom delete_order_by_id PostgreSQL function
    try {
      const { error } = await supabase
        .rpc('delete_order_by_id', { order_id: orderId });

      if (!error) {
        console.log('Order deleted successfully using RPC function');
        return true;
      }

      console.error('RPC delete failed, falling back to manual delete:', error);
    } catch (rpcError) {
      console.error('RPC call error, falling back to manual delete:', rpcError);
    }

    // Second attempt: Try manually deleting the order items first, then the order
    // Note: We're not using "OrderItems" here as it's not in our Supabase schema according to the types
    // Instead, we're relying on the Orders table with its JSON order_items field
    const { error: orderError } = await supabase
      .from('Orders')
      .delete()
      .eq('id', orderId);

    if (orderError) {
      console.error('Error deleting order:', orderError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Order deletion failed:', error);
    return false;
  }
};

export const getAllOrders = async () => {
  try {
    let { data: orders, error } = await supabase
      .from('Orders')
      .select(`
        *,
        OrderItems (
          *,
          Products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return orders || [];
  } catch (error) {
    console.error('Orders fetch failed:', error);
    return [];
  }
};

export const fetchPaginatedOrders = async (page: number, pageSize: number) => {
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
      orders: orders || [],
      totalPages
    };
  } catch (error) {
    console.error('Paginated orders fetch failed:', error);
    return { orders: [], totalPages: 0 };
  }
};

export const getOrdersByCustomerEmail = async (email: string) => {
  try {
    let { data: orders, error } = await supabase
      .from('Orders')
      .select(`
        *,
        OrderItems (
          *,
          Products (*)
        )
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }

    return orders || [];
  } catch (error) {
    console.error('Customer orders fetch failed:', error);
    return [];
  }
};

export const getOrderCounts = async () => {
  try {
    const { count, error } = await supabase
      .from('Orders')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting orders:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Order count failed:', error);
    return 0;
  }
};

// Fix type issues with Products imported from data vs types
export const fixProductImportType = (products: any[]): any[] => {
  return products.map(p => ({
    ...p,
    category: p.category === 'fruit' || p.category === 'vegetable' 
      ? p.category 
      : p.category.toLowerCase().includes('fruit') 
        ? 'fruit' 
        : 'vegetable'
  }));
};
