
import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart }) => {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <span className="inline-flex items-center rounded-full bg-veggie-light px-2 py-1 text-xs font-medium text-veggie-dark mb-2">
          {product.category === 'fruit' ? 'Fruit' : 'Légume'}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold text-veggie-dark mb-2">
          {product.price.toFixed(2)}€ <span className="text-sm text-gray-500">/ {product.unit}</span>
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Description</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>
      
      <div className="mt-auto">
        <Button 
          onClick={onAddToCart}
          className="bg-veggie-primary hover:bg-veggie-dark text-white w-full md:w-auto rounded-md"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Ajouter au Panier
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
