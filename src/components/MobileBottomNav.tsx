import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageSquare, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
const MobileBottomNav = () => {
  const {
    openCart,
    getTotalItems
  } = useCart();
  const {
    favorites
  } = useFavorites();
  const location = useLocation();

  // Hide on thank you page
  if (location.pathname === '/thank-you') {
    return null;
  }
  return <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top flex justify-around py-3 border-t z-50">
      <Link to="/" className="flex flex-col items-center">
        <div className="bg-green-50 rounded-full p-3">
          <Home className="h-5 w-5 text-green-600 stroke-[2.5px]" />
        </div>
        <span className="text-xs font-medium text-gray-800 mt-1">Accueil</span>
      </Link>
      
      <Link to="/favorites" className="flex flex-col items-center relative">
        <div className="rounded-full p-3 bg-green-100">
          <Heart className="h-5 w-5 text-red-500 stroke-[2.5px]" />
          {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {favorites.length}
            </span>}
        </div>
        <span className="text-xs font-medium text-gray-800 mt-1">Favoris</span>
      </Link>
      
      <a href="https://wa.me/+212600000000?text=Je souhaite commander des produits" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
        <div className="rounded-full p-3 bg-green-500">
          <MessageSquare className="h-5 w-5 text-white stroke-[2.5px]" />
        </div>
        <span className="font-medium text-gray-800 mt-1 text-xs">Commander</span>
      </a>
      
      <button onClick={openCart} className="flex flex-col items-center relative">
        <div className="bg-green-50 rounded-full p-3">
          <ShoppingCart className="h-5 w-5 text-green-600 stroke-[2.5px]" />
          {getTotalItems() > 0 && <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>}
        </div>
        <span className="text-xs font-medium text-gray-800 mt-1">Panier</span>
      </button>
    </div>;
};
export default MobileBottomNav;