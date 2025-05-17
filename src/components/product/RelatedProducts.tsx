
import React from 'react';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { Plus } from 'lucide-react';

interface RelatedProductsProps {
  products: Product[];
  categoryText: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, categoryText }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  if (products.length === 0) {
    return null;
  }
  
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
  };
  
  return (
    <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Autres {categoryText}</h2>
      <div className="grid grid-cols-4 gap-2">
        {products.slice(0, 4).map((relatedProduct) => (
          <div 
            key={relatedProduct.id} 
            className="cursor-pointer relative"
            onClick={() => navigate(`/product/${relatedProduct.id}`)}
          >
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={relatedProduct.image} 
                alt={relatedProduct.name}
                className="w-full h-full object-cover" 
              />
            </div>
            {/* Add quick-add button */}
            <button 
              className="absolute bottom-2 right-2 p-1 bg-green-500 rounded-full shadow-md"
              onClick={(e) => handleAddToCart(e, relatedProduct)}
              aria-label="Ajouter au panier"
            >
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
