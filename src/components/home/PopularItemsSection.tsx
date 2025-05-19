
import React from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface PopularItemsSectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  showAll?: boolean;
  category?: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus';
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  title,
  products,
  isLoading = false,
  showAll = false,
  category
}) => {
  const isMobile = useIsMobile();
  
  // Filter products by category if provided
  const filteredProducts = category
    ? products.filter(product => product.category === category)
    : products;
  
  // Limit number of products to display
  // Show 4 products on mobile, 6 on desktop
  const displayProducts = filteredProducts.slice(0, isMobile ? 4 : 6);
  
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="w-full h-24 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (filteredProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {showAll && filteredProducts.length > 6 && (
          <Link to={`/category/${category}`}>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 flex items-center gap-1">
              <span>Voir tout</span>
              <ChevronRight size={16} />
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            discountPercentage={0} 
          />
        ))}
      </div>
    </div>
  );
};

export default PopularItemsSection;
