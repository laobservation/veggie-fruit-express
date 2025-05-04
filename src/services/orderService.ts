
import { supabase } from '@/integrations/supabase/client';
import { Order, RawOrder } from '@/types/order';
import { toast } from '@/hooks/use-toast';

// Define the type for the delete_order_by_id RPC function parameters
interface DeleteOrderParams {
  order_id: number;
}

// Define return type for the delete_order_by_id RPC function
interface DeleteOrderResult {
  success: boolean;
}

// Fetch paginated orders
export const fetchPaginatedOrders = async (page: number, ordersPerPage: number) => {
  try {
    // First get total count for pagination
    const { count, error: countError } = await supabase
      .from('Orders')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting order count:', countError);
      throw countError;
    }

    // Calculate total pages
    const totalItems = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / ordersPerPage));

    // Fetch paginated orders
    const fromIndex = (page - 1) * ordersPerPage;
    const toIndex = fromIndex + ordersPerPage - 1;

    const { data, error } = await supabase
      .from('Orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range(fromIndex, toIndex);

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    // Transform raw data to match our Order interface
    const transformedOrders: Order[] = (data as RawOrder[]).map(order => ({
      id: order.id,
      'Client Name': order['Client Name'] || '',
      'Adresse': order['Adresse'] || '',
      'Phone': order['Phone'],
      order_items: Array.isArray(order.order_items) ? order.order_items as unknown as Order["order_items"] : [],
      total_amount: order.total_amount || 0,
      preferred_time: order.preferred_time || null,
      status: order.status || 'new',
      notified: order.notified || false,
      created_at: order.created_at
    }));

    return { orders: transformedOrders, totalPages };
  } catch (err) {
    console.error('Error in fetching orders:', err);
    throw err;
  }
};

// Delete an order
export const deleteOrder = async (orderId: number) => {
  try {
    console.log(`Attempting to delete order ${orderId} from database`);
    
    // First attempt: standard delete
    const { error } = await supabase
      .from('Orders')
      .delete()
      .eq('id', orderId);
    
    if (error) {
      console.error('Error in first deletion attempt:', error);
      
      // Second attempt: using match
      console.log(`Trying second delete approach for order ${orderId}`);
      const { error: secondAttemptError } = await supabase
        .from('Orders')
        .delete()
        .match({ id: orderId });
      
      if (secondAttemptError) {
        console.error('Second deletion attempt failed:', secondAttemptError);
        
        // Third attempt: using RPC
        console.log(`Trying third delete approach with raw query for order ${orderId}`);
        // Fix: Remove type parameters to let TypeScript infer types automatically
        const { error: thirdAttemptError } = await supabase.rpc<DeleteOrderResult>(
          'delete_order_by_id' as any, // Use type assertion to bypass TypeScript constraint
          { order_id: Number(orderId) }
        );
        
        if (thirdAttemptError) {
          console.error('All deletion attempts failed:', thirdAttemptError);
          throw new Error(`Failed to delete order ${orderId} after multiple attempts`);
        }
      }
    }
    
    // Verify the deletion
    const { data: checkData } = await supabase
      .from('Orders')
      .select('id')
      .eq('id', orderId)
      .maybeSingle();
    
    if (checkData) {
      console.error(`Order ${orderId} still exists after deletion attempts:`, checkData);
      throw new Error("The order couldn't be deleted from the database");
    }
    
    console.log(`Order ${orderId} successfully deleted from database`);
    return true;
  } catch (err) {
    console.error('Error in deleting order:', err);
    throw err;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const { error } = await supabase
      .from('Orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
  }
};
