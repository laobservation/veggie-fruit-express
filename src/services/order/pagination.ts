
import { supabase } from '@/integrations/supabase/client';
import { RawOrder } from '@/types/order';

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
