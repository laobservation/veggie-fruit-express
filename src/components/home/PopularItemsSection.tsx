
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PopularItemsSectionProps {
  title: string;
  products: Product[];
  isLoading: boolean;
  category: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus';
  showAll?: boolean;
  className?: string;
  startIndex?: number;
  productsPerView?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  title,
  products,
  isLoading,
  category,
  showAll = false,
  className = '',
  startIndex = 0,
  productsPerView = 4,
  onNext,
  onPrevious
}) => {
  // Filter products by category
  const categoryProducts = products.filter(
    product => product.category === category
  );
  
  // Determine if navigation is possible
  const hasMoreNext = categoryProducts.length > startIndex + productsPerView;
  const hasMorePrev = startIndex > 0;
  
  // Calculate visible products based on startIndex
  const visibleProducts = categoryProducts.slice(
    startIndex, 
    startIndex + productsPerView
  );
  
  // Skip rendering if no products in this category
  if (categoryProducts.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <div className={cn("px-4 py-6 mb-4", className)}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          
          <div className="flex gap-2">
            <button 
              className={`p-1 rounded-full border border-gray-300 ${!hasMorePrev ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={onPrevious}
              disabled={!hasMorePrev}
            >
              <ChevronLeft size={18} />
            </button>
            
            <button 
              className={`p-1 rounded-full border border-gray-300 ${!hasMoreNext ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={onNext}
              disabled={!hasMoreNext}
            >
              <ChevronRight size={18} />
            </button>
            
            {showAll && (
              <Link
                to={`/category/${category}`}
                className="text-sm text-veggie-primary hover:text-veggie-dark flex items-center ml-2"
              >
                Voir tout
                <ChevronRight size={16} className="ml-1" />
              </Link>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-gray-100 animate-pulse h-[200px] rounded-md"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularItemsSection;
