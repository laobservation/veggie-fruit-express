
import { Heart, Command } from 'lucide-react';
import { Product } from '@/types/product';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/hooks/use-cart';
import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import '@/components/ui/heart-animation.css';

interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  discountPercentage = 0
}) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(false);

  const hasStock = typeof product.stock !== 'undefined';
  const isInStock = hasStock && (product.stock || 0) > 0;

  useEffect(() => {
    setFavoriteStatus(isFavorite(product.id));
  }, [product.id, isFavorite, favorites]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    document.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteStatus(!favoriteStatus);
    setAnimating(true);
    await toggleFavorite(product);
    document.dispatchEvent(new CustomEvent('favorites-updated'));
    setTimeout(() => setAnimating(false), 800);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm relative hover:shadow-md transition-all duration-200 hover:scale-105">
        <div className="relative">
          {discountPercentage > 0 && (
            <div className="absolute bottom-2 right-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-full text-xs z-10">
              {discountPercentage}%
            </div>
          )}
          
          <button 
            onClick={handleFavoriteClick} 
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10 transition-all duration-200 hover:scale-110" 
            aria-label={favoriteStatus ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`h-4 w-4 transition-all duration-200 ${favoriteStatus ? 'fill-red-500 text-red-500' : 'text-gray-400'} ${animating ? 'animate-bounce' : ''}`} />
          </button>
          
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-32 object-cover bg-gray-50" 
            loading="lazy"
            decoding="async"
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
            className={`rounded-full mt-2 transition-all duration-200 flex items-center px-3 py-1 ${
              hasStock && !isInStock 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-105'
            }`} 
            aria-label="Ajouter au panier"
          >
            <span className="text-white text-sm mr-1 font-medium">Ajouter au panier</span>
          </button>
          
          {hasStock && !isInStock && <p className="text-xs text-red-500 mt-1">Épuisé</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
