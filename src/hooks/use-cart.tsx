
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { ServiceOption } from '@/types/product';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Export CartItem interface so it can be used in other files
export interface CartItem {
  product: Product;
  quantity: number;
  selectedServices?: ServiceOption[];
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  cartIconAnimating: boolean;
  isCartReminderVisible: boolean;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingCost: () => number;
  addItem: (product: Product, quantity?: number, selectedServices?: ServiceOption[]) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isCartOpen: boolean;
  toggleCartReminder: (visible: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCartOpen: false,
      cartIconAnimating: false,
      isCartReminderVisible: false,
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          // Include base product price
          let itemTotal = item.product.price * item.quantity;
          
          // Add selected services cost if any
          if (item.selectedServices && item.selectedServices.length > 0) {
            const servicesCost = item.selectedServices.reduce((acc, service) => acc + service.price, 0);
            itemTotal += servicesCost * item.quantity;
          }
          
          return total + itemTotal;
        }, 0);
      },
      
      // Add shipping cost calculation
      getShippingCost: () => {
        // Fixed shipping cost or based on cart total
        const subtotal = get().getTotalPrice();
        // Free shipping for orders over 100
        return subtotal >= 100 ? 0 : 20;
      },
      
      addItem: (product: Product, quantity = 1, selectedServices?: ServiceOption[]) => {
        set((state) => {
          // Find if the product already exists in the cart
          const existingItem = state.items.find((item) => item.product.id === product.id);
          
          let updatedItems;
          
          if (existingItem) {
            // If it exists, update its quantity
            updatedItems = state.items.map((item) => {
              if (item.product.id === product.id) {
                return { 
                  ...item, 
                  quantity: item.quantity + quantity,
                  selectedServices: selectedServices || item.selectedServices
                };
              }
              return item;
            });
          } else {
            // If it doesn't exist, add it to the cart
            updatedItems = [...state.items, { 
              product, 
              quantity,
              selectedServices
            }];
          }
          
          // Start cart icon animation
          set({ cartIconAnimating: true });
          
          // Stop animation after 1 second
          setTimeout(() => {
            set({ cartIconAnimating: false });
          }, 1000);
          
          return { items: updatedItems, isCartOpen: true };
        });
      },
      
      removeItem: (productId: number | string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId: number | string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          
          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                return { ...item, quantity };
              }
              return item;
            }),
          };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      openCart: () => {
        set({ isOpen: true, isCartOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false, isCartOpen: false });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen, isCartOpen: !state.isCartOpen }));
      },
      
      toggleCartReminder: (visible: boolean) => {
        set({ isCartReminderVisible: visible });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Create Cart Notification Provider for cart notifications
type CartNotificationContextType = {
  latestAddedProduct: Product | null;
  quantity: number;
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
  addToNotification: (product: Product, quantity: number) => void;
};

const CartNotificationContext = createContext<CartNotificationContextType | null>(null);

export const CartNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [latestAddedProduct, setLatestAddedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const addToNotification = (product: Product, quantity: number) => {
    setLatestAddedProduct(product);
    setQuantity(quantity);
    setShowNotification(true);
  };

  return (
    <CartNotificationContext.Provider value={{ 
      latestAddedProduct, 
      quantity, 
      showNotification, 
      setShowNotification, 
      addToNotification 
    }}>
      {children}
    </CartNotificationContext.Provider>
  );
};

export const useCartNotification = () => {
  const context = useContext(CartNotificationContext);
  if (!context) {
    throw new Error('useCartNotification must be used within a CartNotificationProvider');
  }
  return context;
};
