
import { Home, Search, ShoppingCart, Heart, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';

const MobileBottomNav = () => {
  const { getTotalItems, openCart } = useCart();
  
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCart();
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 md:hidden z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center">
            <Home className="h-5 w-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Accueil</span>
          </Link>
          
          <Link to="/favorites" className="flex flex-col items-center">
            <Heart className="h-5 w-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Favoris</span>
          </Link>
          
          <button 
            onClick={handleCartClick} 
            className="flex flex-col items-center relative bg-transparent border-none cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {getTotalItems()}
              </span>
            )}
            <span className="text-xs mt-1 text-gray-600">Panier</span>
          </button>
          
          <Link to="/search" className="flex flex-col items-center">
            <Search className="h-5 w-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Recherche</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
