
import { Json } from '@/integrations/supabase/types';

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  id?: number;
  order_id?: number;
  Products?: any; // For joins with the Products table
}

export interface Order {
  id: number;
  'Client Name': string;
  'Adresse': string;
  'Phone': number | null;
  order_items: OrderItem[];
  total_amount?: number;
  preferred_time?: string | null;
  status: OrderStatus;
  notified: boolean;
  created_at: string;
}

// Type for raw order data from Supabase
export interface RawOrder {
  id: number;
  'Client Name': string | null;
  'Adresse': string | null;
  'Phone': number | null;
  order_items?: Json;
  total_amount?: number | null;
  preferred_time?: string | null;
  status?: string | null;
  notified?: boolean | null;
  created_at: string;
}

export interface StatusOption {
  value: string;
  label: string;
  color: string;
}

export const statusOptions: StatusOption[] = [
  { value: 'new', label: 'Nouvelle', color: 'bg-gray-500' },
  { value: 'processing', label: 'En traitement', color: 'bg-blue-500' },
  { value: 'shipped', label: 'Expédiée', color: 'bg-orange-500' },
  { value: 'delivered', label: 'Livrée', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Annulée', color: 'bg-red-500' }
];
