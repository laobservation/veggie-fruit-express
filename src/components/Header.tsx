
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import Cart from './Cart';
import SearchBar from './SearchBar';
import { useFavorites } from '@/hooks/use-favorites';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { getTotalFavorites } = useFavorites();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                Marché Bio
              </span>
            </Link>
          </div>

          {/* Center section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar expanded={true} />
          </div>

          {/* Right section - Search (Mobile), Favorites, Cart */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <div className="md:hidden">
              <SearchBar 
                expanded={isSearchExpanded} 
                onClose={() => setIsSearchExpanded(false)} 
              />
            </div>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Heart className="h-6 w-6" />
              {getTotalFavorites() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalFavorites()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Cart />
          </div>
        </div>

        {/* Mobile Search Expanded */}
        {isSearchExpanded && (
          <div className="md:hidden pb-4">
            <SearchBar 
              expanded={true} 
              onClose={() => setIsSearchExpanded(false)} 
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
