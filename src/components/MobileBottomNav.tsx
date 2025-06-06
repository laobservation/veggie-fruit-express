
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, ShoppingCart, MessageCircle } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { useCart } from '@/hooks/use-cart';

const MobileBottomNav = () => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { getTotalItems, openCart } = useCart();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Handle cart click to open cart instead of navigating
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Mobile cart button clicked - opening cart');
    openCart();
  };

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Accueil' 
    },
    { 
      path: '/favorites', 
      icon: Heart, 
      label: 'Favoris',
      badge: favorites.length > 0 ? favorites.length : null
    },
    { 
      path: '/cart', 
      icon: ShoppingCart, 
      label: 'Panier',
      badge: getTotalItems() > 0 ? getTotalItems() : null,
      isCart: true
    },
    { 
      path: 'http://wa.me/212649150370', 
      icon: MessageCircle, 
      label: 'WhatsApp',
      external: true
    }
  ];

  const formatBadgeNumber = (num: number) => {
    if (num > 99) return '99+';
    return num.toString();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          item.external ? (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center py-2 px-4 text-gray-500 hover:text-green-600 transition-all duration-200 hover:scale-105"
            >
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-sm hover:shadow-md transition-all duration-200 hover:from-green-100 hover:to-green-200">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </a>
          ) : item.isCart ? (
            <button
              key={item.path}
              onClick={handleCartClick}
              className={`flex flex-col items-center py-2 px-4 transition-all duration-200 hover:scale-105 ${
                isActive(item.path) 
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <div className="relative">
                <div className={`p-2 rounded-xl shadow-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 hover:shadow-md'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full shadow-lg">
                    {formatBadgeNumber(item.badge)}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive(item.path) ? 'text-green-600' : ''
              }`}>
                {item.label}
              </span>
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 transition-all duration-200 hover:scale-105 ${
                isActive(item.path) 
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <div className="relative">
                <div className={`p-2 rounded-xl shadow-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 hover:shadow-md'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full shadow-lg">
                    {formatBadgeNumber(item.badge)}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive(item.path) ? 'text-green-600' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          )
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
