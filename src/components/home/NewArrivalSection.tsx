
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import { Heart, Command } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import '@/components/ui/plus-animation.css';

interface NewArrivalSectionProps {
  products: Product[];
  isLoading: boolean;
}

const NewArrivalSection: React.FC<NewArrivalSectionProps> = ({ products, isLoading }) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add item immediately without animation
    addItem(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="px-4 md:px-0 pb-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Nouveautés</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          products.slice(6, 12).map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="bg-white p-4 rounded-lg shadow-sm relative"
            >
              <button 
                onClick={(e) => handleFavoriteClick(e, product)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 z-10"
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </button>
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
                className="absolute bottom-3 right-3 bg-green-500 rounded-full py-1 px-3 flex items-center"
                onClick={(e) => handleAddToCart(e, product)}
                aria-label="Ajouter au panier"
              >
                <span className="text-white text-sm">Ajouter</span>
                <Command className="h-4 w-4 ml-1 text-white" />
              </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NewArrivalSection;
