
import React, { useEffect, useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/formatPrice';
import { Product } from '@/data/products';

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
  
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      role="alert"
    >
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 text-veggie-primary mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Produit ajouté au panier</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-2 flex items-center">
          <div className="h-10 w-10 rounded overflow-hidden mr-3 bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
            <p className="text-xs text-gray-500">
              {quantity} × {formatPrice(product.price)}
            </p>
          </div>
        </div>
        
        <button
          onClick={onViewCart}
          className="mt-3 w-full bg-veggie-light hover:bg-veggie-light/80 text-veggie-dark text-sm py-1.5 px-2 rounded transition-colors"
        >
          Voir le panier
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
