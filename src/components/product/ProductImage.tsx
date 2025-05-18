
import React from 'react';
import { Product } from '@/types/product';
import MediaDisplay from '@/components/MediaDisplay';

interface ProductImageProps {
  product: Product;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm">
      <div className="aspect-square">
        <MediaDisplay 
          product={product} 
          className="w-full h-full object-contain p-6"
          autoplay={false}
          controls={true}
          loading="eager" // Eager loading for the main product image
          isHero={true} // Mark as LCP element
        />
      </div>
    </div>
  );
};

export default ProductImage;
