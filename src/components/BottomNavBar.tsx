
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const { getTotalItems, openCart } = useCart();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30 md:hidden">
      <div className="flex items-center justify-around py-2">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-green-600' : 'text-gray-500'}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/favorites" 
          className={`flex flex-col items-center p-2 ${isActive('/favorites') ? 'text-green-600' : 'text-gray-500'}`}
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
        
        <button 
          onClick={openCart}
          className="flex flex-col items-center p-2 text-gray-500 relative"
        >
          <ShoppingBag size={20} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </button>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-green-600' : 'text-gray-500'}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavBar;
