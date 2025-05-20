
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { ProductService } from '@/types/product';

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

// Export the CartItem type
export type { CartItem };
