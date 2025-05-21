
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const {
    getTotalItems,
    openCart
  } = useCart();
  const { favorites } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFavAnimating, setIsFavAnimating] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    openCart();
  };

  // Add event listeners for cart and favorites updates
  React.useEffect(() => {
    const handleCartUpdated = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    };

    const handleFavoritesUpdated = () => {
      setIsFavAnimating(true);
      setTimeout(() => setIsFavAnimating(false), 600);
    };

    document.addEventListener('cart-updated', handleCartUpdated);
    document.addEventListener('favorites-updated', handleFavoritesUpdated);
    
    return () => {
      document.removeEventListener('cart-updated', handleCartUpdated);
      document.removeEventListener('favorites-updated', handleFavoritesUpdated);
    };
  }, []);
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        <Link to="/" className={cn(
          "flex flex-col items-center justify-center transition-colors", 
          isActive('/') ? "text-green-600" : "text-gray-500"
        )}>
          <div className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 mb-1",
            isActive('/') ? "bg-green-100" : ""
          )}>
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xs">Home</span>
        </Link>
        
        <Link to="/favorites" className={cn(
          "flex flex-col items-center justify-center transition-colors", 
          isActive('/favorites') ? "text-green-600" : "text-gray-500"
        )}>
          <div className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 mb-1 relative",
            isActive('/favorites') ? "bg-green-100" : ""
          )}>
            <Heart className={`h-5 w-5 ${isFavAnimating ? 'animate-bounce' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-xs">Favoris</span>
        </Link>
        
        <a 
          href="#" 
          className="flex flex-col items-center justify-center text-gray-500" 
          onClick={handleCartClick}
        >
          <div className="flex items-center justify-center rounded-full w-8 h-8 mb-1 relative">
            <ShoppingCart className={`h-5 w-5 ${isAnimating ? 'animate-bounce' : ''}`} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {getTotalItems()}
              </span>
            )}
          </div>
          <span className="text-xs">Panier</span>
        </a>
        
        <a 
          href="http://wa.me/212649150370" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-gray-500"
        >
          <div className="flex items-center justify-center rounded-full w-8 h-8 mb-1 bg-green-500">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs">Contact</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBottomNav;
