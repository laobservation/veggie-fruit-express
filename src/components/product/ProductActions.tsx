
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface ProductActionsProps {
  handleAddToCart: () => void;
  handleBuyNow: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ handleAddToCart, handleBuyNow }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between mb-20 md:mb-6 z-10">
      <Button
        variant="outline"
        className="flex-1 mr-2 border-gray-300"
        onClick={handleAddToCart}
      >
        Ajouter
      </Button>
      
      <Button
        className="flex-1 ml-2 bg-green-500 hover:bg-green-600 text-black font-semibold"
        onClick={handleBuyNow}
      >
        Acheter maintenant
      </Button>
    </div>
  );
};

export default ProductActions;
