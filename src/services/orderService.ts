
import { supabase } from '@/integrations/supabase/client';
import { Order, RawOrder } from '@/types/order';
import { toast } from '@/hooks/use-toast';

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
    
    // First attempt: Try using the Edge Function
    try {
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
        'delete_order_by_id',
        {
          body: { order_id: orderId },
        }
      );
      
      if (edgeFunctionError) {
        console.error('Edge function deletion error:', edgeFunctionError);
      } else {
        console.log('Edge function response:', edgeFunctionData);
      }
    } catch (edgeFuncErr) {
      console.error('Error calling edge function:', edgeFuncErr);
      // Continue with direct deletion even if edge function fails
    }
    
    // Second attempt: direct SQL delete
    const { error } = await supabase
      .from('Orders')
      .delete()
      .eq('id', orderId);
    
    if (error) {
      console.error('Error with direct deletion:', error);
      
      // Third attempt: Try using PostgreSQL RPC function
      try {
        // Use the correct rpc method with proper typing
        const { data: rpcData, error: rpcError } = await supabase.rpc<boolean>(
          'delete_order_by_id',
          { order_id: orderId }
        );
        
        if (rpcError) {
          console.error('RPC function error:', rpcError);
        } else {
          console.log('RPC function response:', rpcData);
        }
      } catch (rpcErr) {
        console.error('RPC deletion error:', rpcErr);
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
      throw new Error("The order couldn't be deleted from the database - please try again or contact support");
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
