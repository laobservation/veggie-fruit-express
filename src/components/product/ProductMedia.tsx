
import React from 'react';
import { Product } from '@/types/product';
import MediaDisplay from '@/components/MediaDisplay';

interface ProductMediaProps {
  product: Product;
}

const ProductMedia: React.FC<ProductMediaProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="w-full h-auto aspect-square">
        <MediaDisplay 
          product={product} 
          className="w-full h-full object-cover"
          autoplay={false}
          controls={true}
        />
      </div>
    </div>
  );
};

export default ProductMedia;
