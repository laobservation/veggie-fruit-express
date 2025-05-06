
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { formatPrice } from '@/lib/formatPrice';
import { useTranslations } from '@/hooks/use-translations';
import { t } from '@/hooks/use-translations';

interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean;
  showFavoriteButton?: boolean;
  linkToCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  showAddToCart = true,
  showFavoriteButton = true,
  linkToCategory = false,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { translations } = useTranslations();
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleCardClick = () => {
    if (linkToCategory) {
      navigate(`/category/${product.category}`);
    } else {
      navigate(`/product/${product.id}`);
    }
  };
  
  // Generate product card link
  let productLink = `/product/${product.id}`;
  if (linkToCategory && product.category) {
    productLink = `/category/${product.category}`;
  }
  
  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:bg-gray-800 transition-all cursor-pointer ${className}`}
    >
      <Link to={productLink} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name || 'Product'}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {showFavoriteButton && (
            <button 
              onClick={handleFavoriteToggle}
              className={`absolute top-2 right-2 p-1.5 rounded-full 
                ${isFavorite(product.id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/70 text-gray-600 hover:bg-white'}
                transition-all`}
              aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                fill={isFavorite(product.id) ? 'currentColor' : 'none'} 
                size={18} 
                className={isFavorite(product.id) ? 'animate-heartbeat' : ''}
              />
            </button>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{product.name}</h3>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-end gap-1">
              <span className="text-md font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(product.price || 0)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                / {product.unit}
              </span>
            </div>
            
            {showAddToCart && (
              <Button 
                onClick={handleAddToCart}
                size="sm" 
                className="h-8 px-4 py-0 transition-all rounded-lg"
              >
                Ajouter
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
