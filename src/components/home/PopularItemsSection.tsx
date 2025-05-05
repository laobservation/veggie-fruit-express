
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import { Plus } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PopularItemsSectionProps {
  products: Product[];
  isLoading: boolean;
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({ products, isLoading }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Popular Items</h2>
        <div className="flex gap-2">
          <button className="p-1 rounded-full border border-gray-300 text-gray-600">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1 rounded-full border border-gray-300 text-gray-600">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          products.slice(0, 6).map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="bg-white p-4 rounded-lg shadow-sm relative">
              <div className="flex justify-center mb-3">
                <img src={product.image} alt={product.name} className="h-28 object-cover" />
              </div>
              <h3 className="text-sm font-medium mb-1">{product.name}</h3>
              <div className="flex items-baseline">
                <span className="text-sm text-gray-500 mr-1">{product.unit}</span>
                <span className="text-sm text-gray-500 mr-1">•</span>
                <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              </div>
              <button 
                className="absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 transition-colors z-10"
                onClick={(e) => handleAddToCart(e, product)}
                aria-label="Add to cart"
              >
                <Plus className="h-4 w-4 text-white" />
              </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default PopularItemsSection;
