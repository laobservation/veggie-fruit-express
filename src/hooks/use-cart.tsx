
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import CartNotification from '@/components/CartNotification';

// Define the ProductService type that's used in CartItem
export interface ProductService {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedServices?: ProductService[];
}

interface CartState {
  items: CartItem[];
  cartUpdateCount: number; // Track cart updates for animation
  isOpen: boolean;
  showReminder: boolean;
  addItem: (product: Product, quantity?: number, services?: ProductService[]) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  updateItemServices: (productId: string, services: ProductService[]) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getShippingCost: () => number;
  getTotalItems: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toggleCartReminder: (show: boolean) => void;
}

export const useCart = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      cartUpdateCount: 0,
      isOpen: false,
      showReminder: false,
      addItem: (product, quantity = 1, services = []) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);

        set(state => {
          let newItems;

          if (existingItem) {
            newItems = items.map(item => {
              if (item.product.id === product.id) {
                return {
                  ...item,
                  quantity: item.quantity + quantity,
                  selectedServices: services.length > 0 ? services : item.selectedServices
                };
              }
              return item;
            });
          } else {
            newItems = [...items, { product, quantity, selectedServices: services }];
          }

          return { 
            items: newItems,
            cartUpdateCount: state.cartUpdateCount + 1 // Increment for animation trigger
          };
        });
      },
      removeItem: (productId) => {
        const { items } = get();
        set({ 
          items: items.filter(item => item.product.id !== productId),
          cartUpdateCount: get().cartUpdateCount + 1
        });
      },
      updateItemQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ 
            items: items.filter(item => item.product.id !== productId),
            cartUpdateCount: get().cartUpdateCount + 1
          });
          return;
        }

        set({ 
          items: items.map(item => {
            if (item.product.id === productId) {
              return { ...item, quantity };
            }
            return item;
          }),
          cartUpdateCount: get().cartUpdateCount + 1
        });
      },
      updateItemServices: (productId, services) => {
        const { items } = get();
        set({ 
          items: items.map(item => {
            if (item.product.id === productId) {
              return { ...item, selectedServices: services };
            }
            return item;
          }),
          cartUpdateCount: get().cartUpdateCount + 1
        });
      },
      clearCart: () => set({ items: [], cartUpdateCount: 0 }),
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          // Calculate base product price
          let itemPrice = item.product.price;
          
          // Add costs of any selected services
          if (item.selectedServices && item.selectedServices.length > 0) {
            itemPrice += item.selectedServices.reduce(
              (serviceTotal, service) => serviceTotal + service.price, 0
            );
          }
          
          return total + (itemPrice * item.quantity);
        }, 0);
      },
      getShippingCost: () => {
        return 20; // Fixed at 20DH as mentioned in the header
      },
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      toggleCartReminder: (show) => set({ showReminder: show })
    }),
    {
      name: 'cart-storage'
    }
  )
);

// Context for cart notifications
interface CartNotificationContextProps {
  showNotification: (product: Product, quantity: number) => void;
}

const CartNotificationContext = createContext<CartNotificationContextProps | undefined>(undefined);

// Provider component for cart notifications
export const CartNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ product: Product; quantity: number } | null>(null);
  const { openCart } = useCart();

  const showNotification = (product: Product, quantity: number) => {
    setNotification({ product, quantity });
    
    // Auto-hide after 2 seconds (as requested)
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };
  
  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  const handleViewCart = () => {
    openCart();
    setNotification(null);
  };

  return (
    <CartNotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <CartNotification
          product={notification.product}
          quantity={notification.quantity}
          onClose={handleCloseNotification}
          onViewCart={handleViewCart}
          autoClose={true}
          autoCloseTime={2000} // 2 seconds auto-close
        />
      )}
    </CartNotificationContext.Provider>
  );
};

// Hook to access the cart notification context
export const useCartNotification = () => {
  const context = useContext(CartNotificationContext);
  if (context === undefined) {
    throw new Error('useCartNotification must be used within a CartNotificationProvider');
  }
  return context;
};
