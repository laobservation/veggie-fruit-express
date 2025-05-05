
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

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
              src="/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-100 border-0 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
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
