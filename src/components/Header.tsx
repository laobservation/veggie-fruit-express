
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Heart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useCategories } from '@/hooks/use-categories';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import MobileMenu from './MobileMenu';
import Cart from './Cart';
import SearchBar from './SearchBar';

interface Settings {
  site_name: string;
}

const Header: React.FC = () => {
  const { items } = useCart();
  const { favorites } = useFavorites();
  const { categories } = useCategories();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({ site_name: 'Marché Bio' });

  // Get visible categories for desktop menu
  const visibleCategories = categories.filter(cat => cat.is_visible !== false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('site_name')
          .eq('id', 1)
          .maybeSingle();
        
        if (data && !error) {
          setSettings({ site_name: data.site_name || 'Marché Bio' });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const getCategoryUrl = (categoryName: string) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('fruit')) return '/fruits';
    if (lowerName.includes('légume') || lowerName.includes('legume')) return '/vegetables';
    if (lowerName.includes('pack')) return '/category/pack';
    if (lowerName.includes('boisson') || lowerName.includes('drink')) return '/category/drink';
    if (lowerName.includes('salade') || lowerName.includes('jus')) return '/category/salade-jus';
    return '/';
  };

  if (isMobile) {
    return (
      <>
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <Link to="/" className="text-xl font-bold text-green-600">
                {settings.site_name}
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link to="/favorites" className="relative text-gray-600 hover:text-green-600 transition-colors">
                  <Heart className="h-6 w-6" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
                
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <MobileMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
        
        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-green-600">
                {settings.site_name}
              </Link>
              
              {/* Desktop Categories Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Accueil
                </Link>
                {visibleCategories.map((category) => (
                  <Link 
                    key={category.id}
                    to={getCategoryUrl(category.name)}
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar />
              
              <Link to="/favorites" className="relative text-gray-600 hover:text-green-600 transition-colors">
                <Heart className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-green-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Header;
