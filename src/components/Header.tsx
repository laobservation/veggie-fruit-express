
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, openCart } = useCart();
  const isMobile = useIsMobile();
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const handleCartClick = () => {
    openCart();
  };

  return (
    <header className="bg-gray-50 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        <div className="flex items-center gap-6">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {!isMobileMenuOpen ? (
                <Menu className="h-6 w-6 text-gray-700" />
              ) : (
                <span className="h-6 w-6 text-gray-700">✕</span>
              )}
              <span className="sr-only">Menu</span>
            </Button>
          )}
          
          <div className="hidden md:block">
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-800">2464 Royal Ln. Mesa</h3>
              <p className="text-sm text-gray-500">Your address</p>
            </div>
          </div>
        </div>
        
        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png" 
              alt="Marché Bio Logo" 
              className="h-14 w-auto object-contain" 
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block max-w-md">
            <SearchBar />
          </div>
          
          <button 
            onClick={handleCartClick} 
            className="relative bg-green-50 rounded-full p-2 flex items-center"
          >
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-semibold ml-2">
              {getTotalItems() < 10 ? `0${getTotalItems()}` : getTotalItems()}
            </span>
          </button>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
