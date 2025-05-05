
import { Json } from '@/integrations/supabase/types';
import { Order, OrderItem, OrderStatus, RawOrder } from '@/types/order';

// Helper type for converting OrderItem to Json
export type OrderItemJson = {
  productId: number | string;
  productName: string;
  quantity: number;
  price: number;
};
