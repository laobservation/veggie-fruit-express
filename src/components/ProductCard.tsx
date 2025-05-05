
import { Heart, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import '@/components/ui/heart-animation.css';

interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, discountPercentage = 0 }) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);
  
  // Check if product has stock information
  const hasStock = typeof product.stock !== 'undefined';
  const isInStock = hasStock && (product.stock || 0) > 0;
  const favoriteStatus = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleFavorite(product);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm relative">
        <div className="relative">
          {discountPercentage > 0 && (
            <div className="absolute bottom-2 right-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-full text-xs z-10">
              {discountPercentage}%
            </div>
          )}
          
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10"
            aria-label={favoriteStatus ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-4 w-4 heart-animation ${favoriteStatus ? 'fill-red-500 text-red-500' : 'text-gray-400'} ${animating ? 'active' : ''}`} 
            />
          </button>
          
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-cover bg-gray-50"
          />
        </div>
        
        <div className="p-3 flex flex-col items-center">
          <h3 className="text-gray-800 font-medium text-sm text-center">{product.name}</h3>
          <div className="font-bold text-gray-900 mt-2">
            {formatPrice(product.price)}
            <span className="text-xs text-gray-500 font-normal ml-1">/{product.unit}</span>
          </div>
            
          <button 
            onClick={handleAddToCart}
            disabled={hasStock && !isInStock}
            className={`rounded-full p-2 mt-2 ${
              hasStock && !isInStock 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-yellow-400 hover:bg-yellow-500'
            } transition-colors`}
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
          
          {hasStock && !isInStock && (
            <p className="text-xs text-red-500 mt-1">Épuisé</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
