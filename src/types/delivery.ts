
import { CartItem } from '@/hooks/use-cart';

export interface OrderDetails {
  name: string;
  address: string;
  phone: string;
  preferredTime: string;
  totalAmount: number;
  items: CartItem[];
  date: string;
  orderId?: number;
}

export type FormValues = {
  name: string;
  address: string;
  phone: string;
  preferDeliveryTime: boolean;
  deliveryTime?: string;
};
