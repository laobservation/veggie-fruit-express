
import React, { useEffect, useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/formatPrice';
import { Product } from '@/types/product';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/hooks/use-cart';

interface CartNotificationProps {
  product: Product;
  quantity: number;
  onClose: () => void;
  onViewCart: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  product,
  quantity,
  onClose,
  onViewCart,
  autoClose = true,
  autoCloseTime = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const { openCart } = useCart();
  
  useEffect(() => {
    // Trigger animation after a small delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    // Auto close after specified time
    let closeTimer: NodeJS.Timeout;
    if (autoClose) {
      closeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation before removing
      }, autoCloseTime);
    }
    
    return () => {
      clearTimeout(showTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [autoClose, autoCloseTime, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation before removing
  };
  
  const handleViewCart = () => {
    openCart();
    onViewCart();
  };
  
  return (
    <div
      className={cn(
        "fixed z-50 bg-white shadow-lg transition-all duration-300 transform",
        isVisible ? "opacity-100" : "opacity-0",
        isMobile 
          ? "bottom-0 left-0 right-0 border-t border-gray-200 translate-y-0" 
          : "bottom-4 right-4 w-80 rounded-lg border border-gray-200",
        !isVisible && (isMobile ? "translate-y-4" : "translate-y-2")
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-veggie-light p-2 rounded-full mr-2">
              <ShoppingCart className="h-5 w-5 text-veggie-primary" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Produit ajouté au panier</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-3 flex items-center">
          <div className="h-14 w-14 rounded-md overflow-hidden mr-3 bg-gray-100 shadow-sm border border-gray-200">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
            <p className="text-sm text-veggie-dark font-semibold">
              {quantity} × {formatPrice(product.price)}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleViewCart}
          className="mt-3 w-full bg-veggie-primary hover:bg-veggie-dark text-white text-sm py-2 px-4 rounded transition-colors font-medium"
        >
          Voir le panier
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
