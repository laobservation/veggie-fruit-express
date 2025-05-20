
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { getTotalItems, openCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    openCart();
  };
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/') && "text-green-600"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/favorites"
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/favorites') && "text-green-600"
          )}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">Favoris</span>
        </Link>
        
        <a
          href="#"
          className="flex flex-col items-center justify-center"
          onClick={handleCartClick}
        >
          <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <span className={`absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] ${isAnimating ? 'scale-110 transition-transform' : ''}`}>
                {getTotalItems()}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Panier</span>
        </a>
        
        <Link
          to="/admin"
          className={cn(
            "flex flex-col items-center justify-center",
            isActive('/admin') && "text-green-600"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Compte</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
