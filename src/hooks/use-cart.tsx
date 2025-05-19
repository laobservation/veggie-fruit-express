
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  cartIconAnimating: boolean;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  addItem: (product: Product) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      cartIconAnimating: false,
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },
      
      addItem: (product: Product) => {
        set((state) => {
          // Find if the product already exists in the cart
          const existingItem = state.items.find((item) => item.id === product.id);
          
          let updatedItems;
          
          if (existingItem) {
            // If it exists, update its quantity
            updatedItems = state.items.map((item) => {
              if (item.id === product.id) {
                return { ...item, quantity: item.quantity + 1 };
              }
              return item;
            });
          } else {
            // If it doesn't exist, add it to the cart
            updatedItems = [...state.items, { ...product, quantity: 1 }];
          }
          
          // Start cart icon animation
          set({ cartIconAnimating: true });
          
          // Stop animation after 1 second
          setTimeout(() => {
            set({ cartIconAnimating: false });
          }, 1000);
          
          return { items: updatedItems };
        });
      },
      
      removeItem: (productId: number | string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      
      updateQuantity: (productId: number | string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }
          
          return {
            items: state.items.map((item) => {
              if (item.id === productId) {
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
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
