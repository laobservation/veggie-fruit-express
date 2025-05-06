
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import { Plus, Heart, Command } from 'lucide-react';
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
  const [touchedProductId, setTouchedProductId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the button element
    const button = e.currentTarget as HTMLButtonElement;
    const icon = button.querySelector('.plus-icon');
    
    if (icon) {
      icon.classList.add('animate-spin');
      
      // Add item after a slight delay to let the animation play
      setTimeout(() => {
        addItem(product);
        icon.classList.remove('animate-spin');
      }, 300);
    } else {
      addItem(product);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleProductTouch = (productId: string) => {
    setTouchedProductId(productId);
  };

  return (
    <div className="px-4 md:px-0 pb-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">New Arrival</h2>
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
              onTouchStart={() => handleProductTouch(product.id)}
            >
              <button 
                onClick={(e) => handleFavoriteClick(e, product)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10"
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
                className={`absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 transition-colors plus-button ${touchedProductId === product.id ? 'touched' : ''}`}
                onClick={(e) => handleAddToCart(e, product)}
                aria-label="Add to cart"
              >
                <Plus className="h-4 w-4 text-white plus-icon" />
                <Command className="h-4 w-4 text-white command-icon" />
              </button>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NewArrivalSection;
