
import React from 'react';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';

interface RelatedProductsProps {
  products: Product[];
  categoryText: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, categoryText }) => {
  const navigate = useNavigate();
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Autres {categoryText}</h2>
      <div className="grid grid-cols-4 gap-2">
        {products.slice(0, 4).map((relatedProduct) => (
          <div 
            key={relatedProduct.id} 
            className="cursor-pointer"
            onClick={() => navigate(`/product/${relatedProduct.id}`)}
          >
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={relatedProduct.image} 
                alt={relatedProduct.name}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
