
import { Json } from '@/integrations/supabase/types';
import { Order, OrderItem, OrderStatus, RawOrder } from '@/types/order';

// Helper type for converting OrderItem to Json
export type OrderItemJson = {
  productId: number; // Change to number only to match the OrderItem type
  productName: string;
  quantity: number;
  price: number;
};
