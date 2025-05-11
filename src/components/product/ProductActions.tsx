import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
interface ProductActionsProps {
  handleAddToCart: () => void;
  handleBuyNow: () => void;
}
const ProductActions: React.FC<ProductActionsProps> = ({
  handleAddToCart,
  handleBuyNow
}) => {
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between mb-20 md:mb-6 z-10">
      <Button variant="outline" className="flex-1 mr-2 flex items-center justify-center gap-2 border-gray-300" onClick={handleAddToCart}>
        <ShoppingBag className="h-5 w-5" />
        <span className="md:inline hidden">Ajouter au panier</span>
        <span className="md:hidden inline">Ajouter</span>
      </Button>
      
      <Button onClick={handleBuyNow} className="flex-1 ml-2 text-white bg-green-600 hover:bg-green-500 font-bold">
        Acheter maintenant
      </Button>
    </div>;
};
export default ProductActions;