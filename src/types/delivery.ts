
import { CartItem } from '@/hooks/use-cart';

export interface FormValues {
  name: string;
  address: string;
  phone: string;
  preferDeliveryTime: boolean;
  deliveryTime: 'matin' | 'après-midi';
  deliveryDay: string;
}

export interface OrderData {
  clientName: string;
  address: string;
  phone: string;
  items: CartItem[];
  preferredTime: string;
  deliveryDay: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
}
