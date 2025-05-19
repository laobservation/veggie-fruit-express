
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { ReactNode, useState, useEffect } from 'react';
import CartNotification from '@/components/CartNotification';
import { ServiceOption } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedServices?: ServiceOption[];
}

interface CartState {
  items: CartItem[];
  showNotification: boolean;
  notificationItem: CartItem | null;
  isCartOpen: boolean;
  cartReminder: boolean;
  cartIconAnimating: boolean;
  addItem: (product: Product, quantity?: number, selectedServices?: ServiceOption[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingCost: () => number;
  hideNotification: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCartReminder: (state: boolean) => void;
  setCartIconAnimating: (state: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      showNotification: false,
      notificationItem: null,
      isCartOpen: false,
      cartReminder: false,
      cartIconAnimating: false,
      addItem: (product: Product, quantity = 1, selectedServices = []) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

        if (existingItemIndex !== -1) {
          // If the item exists, check if it has the same services
          const existingItem = currentItems[existingItemIndex];
          const hasSameServices = 
            JSON.stringify(existingItem.selectedServices?.map(s => s.id).sort()) === 
            JSON.stringify(selectedServices?.map(s => s.id).sort());
          
          if (hasSameServices) {
            // Update quantity for the item with same services
            const updatedItems = currentItems.map((item, index) => 
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            
            set({
              items: updatedItems,
              showNotification: true,
              notificationItem: {
                product,
                quantity: existingItem.quantity + quantity,
                selectedServices
              },
              cartIconAnimating: true
            });
          } else {
            // Add as a new item because services are different
            set({ 
              items: [...currentItems, { product, quantity, selectedServices }],
              showNotification: true,
              notificationItem: { product, quantity, selectedServices },
              cartIconAnimating: true
            });
          }
        } else {
          // If the item doesn't exist, add it
          set({ 
            items: [...currentItems, { product, quantity, selectedServices }],
            showNotification: true,
            notificationItem: { product, quantity, selectedServices },
            cartIconAnimating: true
          });
        }
        
        // Reset animation state after animation completes
        setTimeout(() => {
          set({ cartIconAnimating: false });
        }, 1000);
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
        const itemsTotal = get().items.reduce((total, item) => {
          // Calculate product price
          const productTotal = item.product.price * item.quantity;
          
          // Add service costs if any
          const servicesCost = (item.selectedServices?.reduce((acc, service) => 
            acc + service.price, 0) || 0) * item.quantity;
            
          return total + productTotal + servicesCost;
        }, 0);
        
        // Add shipping cost
        return itemsTotal;
      },
      getShippingCost: () => {
        // Fixed shipping cost of 20 DH
        return get().items.length > 0 ? 20 : 0;
      },
      hideNotification: () => set({ 
        showNotification: false, 
        notificationItem: null
      }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCartReminder: (state: boolean) => set({ cartReminder: state }),
      setCartIconAnimating: (state: boolean) => set({ cartIconAnimating: state })
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
    openCart
  } = useCart();

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
    </>
  );
};
