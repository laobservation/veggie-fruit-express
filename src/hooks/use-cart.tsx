import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';
import { ReactNode, useState, useEffect } from 'react';
import CartNotification from '@/components/CartNotification';
import { ShoppingCart, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  showNotification: boolean;
  notificationItem: CartItem | null;
  showCartReminder: boolean;
  isCartOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hideNotification: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCartReminder: (show: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      showNotification: false,
      notificationItem: null,
      showCartReminder: false,
      isCartOpen: false,
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
            },
            showCartReminder: false
          });
        } else {
          set({ 
            items: [...currentItems, { product, quantity }],
            showNotification: true,
            notificationItem: { product, quantity },
            showCartReminder: false
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
      hideNotification: () => set({ 
        showNotification: false, 
        notificationItem: null,
        showCartReminder: true
      }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCartReminder: (show) => set({ showCartReminder: show })
    }),
    {
      name: 'cart-storage',
    }
  )
);

// CartNotificationProvider component to render notifications
export const CartNotificationProvider = ({ children }: { children: ReactNode }) => {
  const { 
    showNotification, 
    notificationItem, 
    hideNotification, 
    showCartReminder,
    toggleCartReminder,
    openCart,
    isCartOpen,
    closeCart,
    getTotalItems
  } = useCart();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // This prevents the cart reminder from showing on initial page load
    if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  return (
    <>
      {children}
      
      {showNotification && notificationItem && (
        <CartNotification
          product={notificationItem.product}
          quantity={notificationItem.quantity}
          onClose={hideNotification}
          onViewCart={() => {
            openCart();
            hideNotification();
          }}
        />
      )}

      {showCartReminder && hasInitialized && !isCartOpen && (
        <div 
          className={cn(
            "fixed bottom-4 right-4 z-40 flex flex-col gap-2 animate-fade-in"
          )}
        >
          <Button 
            onClick={() => window.open("https://wa.me/+212600000000?text=Je souhaite commander des produits", "_blank")}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg"
            size="icon"
          >
            <Smartphone className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={openCart}
            className="bg-veggie-primary hover:bg-veggie-dark text-white rounded-full p-3 shadow-lg"
            size="icon"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-veggie-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          </Button>
        </div>
      )}
    </>
  );
};
