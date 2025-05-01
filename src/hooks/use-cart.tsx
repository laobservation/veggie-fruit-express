
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';
import { ReactNode, useState } from 'react';
import CartNotification from '@/components/CartNotification';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  showNotification: boolean;
  notificationItem: CartItem | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hideNotification: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      showNotification: false,
      notificationItem: null,
      addItem: (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            showNotification: true,
            notificationItem: {
              product,
              quantity: existingItem.quantity + quantity
            }
          });
        } else {
          set({ 
            items: [...currentItems, { product, quantity }],
            showNotification: true,
            notificationItem: { product, quantity }
          });
        }
      },
      removeItem: (productId: string) => {
        const currentItems = get().items;
        set({
          items: currentItems.filter(item => item.product.id !== productId),
        });
      },
      updateQuantity: (productId: string, quantity: number) => {
        const currentItems = get().items;
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: currentItems.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      hideNotification: () => set({ showNotification: false, notificationItem: null }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// CartNotificationProvider component to render notifications
export const CartNotificationProvider = ({ children }: { children: ReactNode }) => {
  const { showNotification, notificationItem, hideNotification } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {children}
      
      {showNotification && notificationItem && (
        <CartNotification
          product={notificationItem.product}
          quantity={notificationItem.quantity}
          onClose={hideNotification}
          onViewCart={() => {
            setIsCartOpen(true);
            hideNotification();
          }}
        />
      )}
    </>
  );
};
