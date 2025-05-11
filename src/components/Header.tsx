import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';
const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    getTotalItems,
    openCart
  } = useCart();
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
  return <header className="py-4 bg-transparent">
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        <div className="flex items-center gap-6">
          {isMobile && <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mr-2 relative z-50 px-0 py-0 mx-[4px] my-0 bg-transparent">
              {!isMobileMenuOpen ? <Menu className="h-6 w-6 text-gray-700 mx-0 my-0 px-0 py-0 text-base font-semibold" /> : <span className="h-6 w-6 text-gray-700">✕</span>}
              <span className="sr-only">Menu</span>
            </Button>}
          
          <div className="hidden md:block">
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-800">Meknès, Maroc</h3>
              <p className="text-sm text-gray-500">Livraison et Préparation  20DH</p>
            </div>
          </div>
        </div>
        
        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png" alt="Marché Bio Logo" className="h-14 w-auto object-contain" />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block max-w-md">
            <SearchBar />
          </div>
          
          <button onClick={handleCartClick} className="relative rounded-full p-2 flex items-center bg-transparent">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-semibold ml-2">
              {getTotalItems() < 10 ? `0${getTotalItems()}` : getTotalItems()}
            </span>
          </button>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>;
};
export default Header;