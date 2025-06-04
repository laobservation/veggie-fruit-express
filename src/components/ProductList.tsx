
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductGrid from '@/components/ProductGrid';
import { fetchProducts } from '@/lib/data';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 6)); // Show first 6 products
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <ProductGrid 
      products={products} 
      isLoading={isLoading} 
    />
  );
};

export default ProductList;
