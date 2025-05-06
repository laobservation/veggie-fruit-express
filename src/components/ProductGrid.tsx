import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
