
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import logo from '@/assets/images/logo.png';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user } = useAuth();

  const totalItems = getTotalItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 mr-2" />
              <span className="font-bold">Ma Boutique</span>
            </Link>
            <SearchBar />
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-gray-600'}>
              Accueil
            </NavLink>
            <NavLink to="/category/1" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-gray-600'}>
              Produits
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-gray-600'}>
              À Propos
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'hover:text-gray-600'}>
              Contact
            </NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/favorites" className="hover:text-gray-600">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative hover:text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Authentication UI */}
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Button>
              </Link>
            )}
            
            <button onClick={toggleMobileMenu} className="md:hidden">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden py-2">
            <nav className="flex flex-col space-y-3">
              <NavLink to="/" className="block hover:text-gray-600">
                Accueil
              </NavLink>
              <NavLink to="/category/1" className="block hover:text-gray-600">
                Produits
              </NavLink>
              <NavLink to="/about" className="block hover:text-gray-600">
                À Propos
              </NavLink>
              <NavLink to="/contact" className="block hover:text-gray-600">
                Contact
              </NavLink>
              <Link to="/favorites" className="block hover:text-gray-600">
                Favoris
              </Link>
              <Link to="/cart" className="block hover:text-gray-600">
                Panier
              </Link>
              {user ? (
                <UserMenu />
              ) : (
                <Link to="/auth" className="block hover:text-gray-600">
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
