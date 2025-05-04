
import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface StickyAddToCartProps {
  product: Product;
  onAddToCart: () => void;
  isVisible: boolean;
}

const StickyAddToCart: React.FC<StickyAddToCartProps> = ({ 
  product, 
  onAddToCart, 
  isVisible 
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'} z-50`}>
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{product.name}</h3>
          <p className="text-xl font-semibold text-veggie-dark">{product.price.toFixed(2)}€</p>
        </div>
        <Button 
          onClick={onAddToCart}
          className="bg-veggie-primary hover:bg-veggie-dark text-white"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Ajouter au Panier
        </Button>
      </div>
    </div>
  );
};

export default StickyAddToCart;
