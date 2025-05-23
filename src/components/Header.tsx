
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Menu, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';
import { useFavorites } from '@/hooks/use-favorites';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantityAnimating, setQuantityAnimating] = useState(false);
  
  const {
    getTotalItems,
    openCart
  } = useCart();

  const { favorites } = useFavorites();
  
  const isMobile = useIsMobile();

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    const handleCartUpdated = () => {
      setIsAnimating(true);
      setQuantityAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      setTimeout(() => setQuantityAnimating(false), 800);
    };

    document.addEventListener('cart-updated', handleCartUpdated);
    return () => {
      document.removeEventListener('cart-updated', handleCartUpdated);
    };
  }, []);

  const handleCartClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    openCart();
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm py-[19px]">
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        <div className="flex items-center gap-6">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="mr-2 relative z-50 px-0 py-0 mx-[4px] my-0 bg-transparent"
            >
              {!isMobileMenuOpen ? (
                <Menu className="h-6 w-6 text-gray-700 mx-0 my-0 px-0 py-0 text-base font-semibold" />
              ) : (
                <span className="h-6 w-6 text-gray-700">✕</span>
              )}
              <span className="sr-only">Menu</span>
            </Button>
          )}
          
          <div className="hidden md:block">
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-800">Meknès, Maroc</h3>
              <p className="text-sm text-gray-500">Livraison et Préparation 20DH</p>
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
              loading="eager"
              fetchPriority="high"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block max-w-md">
            <SearchBar />
          </div>
          
          {/* WhatsApp Button (only visible on desktop) */}
          <div className="hidden md:block">
            <a 
              href="http://wa.me/212649150370"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg"
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </a>
          </div>
          
          <button 
            onClick={handleCartClick} 
            className="relative rounded-full p-2 flex items-center bg-transparent"
            aria-label="View cart"
          >
            <div className="relative">
              <ShoppingCart className={`h-5 w-5 text-green-600 transition-transform duration-300 ${isAnimating ? 'animate-bounce scale-125' : ''}`} />
              {getTotalItems() > 0 && (
                <span className={`absolute -top-3 -right-3 flex items-center justify-center bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold shadow-lg transition-all duration-300 ${quantityAnimating ? 'animate-pulse scale-110' : ''}`}>
                  {getTotalItems()}
                </span>
              )}
            </div>
            <span className="text-green-600 font-semibold ml-2 hidden md:inline-block">
              Panier
            </span>
          </button>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
