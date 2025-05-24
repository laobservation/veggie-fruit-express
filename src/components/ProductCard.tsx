
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import { Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import '@/components/ui/plus-animation.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    
    // Dispatch custom event for favorite animation
    document.dispatchEvent(new CustomEvent('favorite-updated'));
  };

  // Create SEO-friendly slug from product name
  const createSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const productUrl = `/product/${product.id}/${createSlug(product.name)}`;

  return (
    <Link 
      to={productUrl}
      className="bg-white p-4 rounded-lg shadow-sm relative mx-0 my-0 px-[8px] py-[8px] hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <button 
        onClick={handleFavoriteClick} 
        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 z-10 hover:bg-white transition-all duration-200"
      >
        <Heart 
          className={`h-4 w-4 transition-all duration-200 ${
            isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`} 
        />
      </button>
      <div className="flex justify-center mb-3 text-green-500 bg-white px-0 py-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-28 object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium mb-1 text-center">{product.name}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-sm text-gray-500 mr-1">{product.unit}</span>
          <span className="text-sm text-gray-500 mr-1">/</span>
          <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
        </div>
        <button 
          onClick={handleAddToCart} 
          aria-label="Ajouter au panier" 
          className="bg-green-500 rounded-full flex items-center px-[15px] mx-0 my-0 py-[5px] hover:bg-green-600 transition-all duration-200 hover:scale-105"
        >
          <span className="text-white font-bold text-xs">Ajouter au panier</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
