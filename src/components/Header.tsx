
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems } = useCart();
  const isMobile = useIsMobile();
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b transition-shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
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
                <X className="h-6 w-6 text-gray-700" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          )}
          
          <Link to="/" className={`flex items-center gap-2 ${isMobile ? 'mx-auto' : ''}`}>
            <img 
              src="/lovable-uploads/7eb3dccd-9b4a-4f2b-afbe-ca6658b17929.png" 
              alt="Marché Bio Logo" 
              className="h-10"
            />
          </Link>
        </div>
        
        {!isMobile && (
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-veggie-primary transition-colors font-medium relative group">
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-veggie-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/fruits" className="text-gray-700 hover:text-veggie-primary transition-colors font-medium relative group">
              Fruits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-veggie-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/vegetables" className="text-gray-700 hover:text-veggie-primary transition-colors font-medium relative group">
              Légumes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-veggie-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        )}
        
        <div className="flex items-center gap-2">
          {isMobile ? (
            <>
              {isSearchOpen ? (
                <div className="fixed inset-0 bg-black/20 z-40 flex items-start pt-16 px-4">
                  <div className="bg-white w-full p-2 rounded-md shadow-lg">
                    <SearchBar 
                      onClose={() => setIsSearchOpen(false)}
                      expanded={true} 
                    />
                  </div>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5 text-gray-700" />
                </Button>
              )}
            </>
          ) : (
            <SearchBar expanded={false} />
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-veggie-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
