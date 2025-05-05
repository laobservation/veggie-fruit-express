
import { Json } from '@/integrations/supabase/types';
import { Order, OrderItem, OrderStatus, RawOrder } from '@/types/order';
import { OrderItemJson } from './types';

// Helper function to convert OrderItem[] to Json for Supabase storage
export const convertOrderItemsToJson = (items: OrderItem[]): Json => {
  // Convert items to plain objects that match the Json type
  return items.map(item => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: item.price
  })) as unknown as Json;
};

// Helper function to convert Json to OrderItem[] from Supabase retrieval
export const convertJsonToOrderItems = (json: Json | null): OrderItem[] => {
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
