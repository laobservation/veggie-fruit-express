
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface ProductActionsProps {
  handleAddToCart: () => void;
  handleBuyNow: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ handleAddToCart, handleBuyNow }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between mb-20 md:mb-6">
      <Button
        variant="outline"
        className="flex items-center gap-2 border-gray-300"
        onClick={handleAddToCart}
      >
        <ShoppingBag className="h-5 w-5" />
        Ajouter au panier
      </Button>
      
      <Button
        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8"
        onClick={handleBuyNow}
      >
        Acheter maintenant
      </Button>
    </div>
  );
};

export default ProductActions;
