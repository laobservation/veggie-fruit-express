
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/hooks/use-cart';
import MediaDisplay from '@/components/MediaDisplay';
import { useState } from 'react';
import '@/components/ui/heart-animation.css';

interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, discountPercentage = 0 }) => {
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // Check if product has stock information
  const hasStock = typeof product.stock !== 'undefined';
  const isInStock = hasStock && (product.stock || 0) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    setIsFavorite(!isFavorite);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative">
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-full text-sm z-10">
              {discountPercentage}%
            </div>
          )}
          
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white z-10"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 heart-animation ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} ${animating ? 'active' : ''}`} 
            />
          </button>
          
          <AspectRatio ratio={1/1} className="bg-gray-50">
            <MediaDisplay 
              product={product}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        
        <div className="p-3">
          <div className="mb-1">
            <h3 className="text-gray-800 font-medium">{product.name}</h3>
            <p className="text-gray-500 text-sm">{product.category === 'fruit' ? 'Fresh fruits' : 'Fresh vegetables'}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="font-bold text-gray-900">
              {formatPrice(product.price)}
              <span className="text-xs text-gray-500 font-normal ml-1">/{product.unit}</span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={hasStock && !isInStock}
              className={`rounded-full p-2 ${
                hasStock && !isInStock 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-yellow-400 hover:bg-yellow-500'
              } transition-colors`}
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4 text-white" />
            </button>
          </div>
          
          {hasStock && !isInStock && (
            <p className="text-xs text-red-500 mt-1">Épuisé</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
