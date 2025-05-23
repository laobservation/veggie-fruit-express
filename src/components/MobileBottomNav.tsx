
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Grid3X3, MessageCircle } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';

const MobileBottomNav = () => {
  const location = useLocation();
  const { favorites } = useFavorites();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
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
      path: '/category/all', 
      icon: Grid3X3, 
      label: 'Catégories' 
    },
    { 
      path: 'http://wa.me/212649150370', 
      icon: MessageCircle, 
      label: 'WhatsApp',
      external: true
    }
  ];

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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {item.badge}
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
