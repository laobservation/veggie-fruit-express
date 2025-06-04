import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Menu, Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';
import { useFavorites } from '@/hooks/use-favorites';
import { useCategories } from '@/hooks/use-categories';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantityAnimating, setQuantityAnimating] = useState(false);
  const [favoriteAnimating, setFavoriteAnimating] = useState(false);
  const {
    getTotalItems,
    openCart,
    isCartOpen,
    closeCart
  } = useCart();
  const {
    favorites
  } = useFavorites();
  const {
    categories
  } = useCategories();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

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
    const handleFavoriteUpdated = () => {
      setFavoriteAnimating(true);
      setTimeout(() => setFavoriteAnimating(false), 600);
    };
    document.addEventListener('cart-updated', handleCartUpdated);
    document.addEventListener('favorite-updated', handleFavoriteUpdated);
    return () => {
      document.removeEventListener('cart-updated', handleCartUpdated);
      document.removeEventListener('favorite-updated', handleFavoriteUpdated);
    };
  }, []);
  const handleCartClick = () => {
    console.log('Cart button clicked - opening cart');
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    openCart();
  };

  // Filter visible categories and limit to 4 for desktop display
  const visibleCategories = categories.filter(cat => cat.is_visible !== false).slice(0, 4);

  // Helper function to create category path from name
  const getCategoryPath = (categoryName: string) => {
    let pathName = categoryName.toLowerCase().replace(/\s+/g, '-');

    // Special handling for certain categories to maintain consistent URL structure
    if (pathName === 'fruit') pathName = 'fruits';
    if (pathName === 'vegetable' || pathName === 'légume') pathName = 'légumes';
    if (pathName === 'pack') pathName = 'packs';
    if (pathName === 'drink') pathName = 'drinks';
    return `/category/${pathName}`;
  };
  return <>
      <header className="bg-white sticky top-0 z-50 shadow-sm py-[19px]">
        <div className={`container mx-auto px-4 flex items-center justify-between relative ${isRTL ? 'font-arabic' : ''}`}>
          <div className="flex items-center gap-6">
            {isMobile && <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`mr-2 relative z-50 px-0 bg-transparent py-0 mx-[18px] my-0 ${isRTL ? 'ml-2 mr-0 mx-0' : ''}`}>
                {!isMobileMenuOpen ? <Menu className="h-6 w-6 text-gray-700 mx-0 px-0 text-base font-semibold my-[2px] py-0" /> : <span className="h-6 w-6 text-gray-700">✕</span>}
                <span className="sr-only">Menu</span>
              </Button>}
            
            {/* Desktop Categories - Left side */}
            {!isMobile}
            
            <div className="hidden md:block">
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-800">{t('header.location')}</h3>
                <p className="text-sm text-gray-500">{t('header.delivery')}</p>
              </div>
            </div>
          </div>
          
          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png" alt="Marché Bio Logo" loading="eager" fetchPriority="high" className="h-14 w-auto object-contain" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block max-w-md">
              <SearchBar />
            </div>
            
            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* WhatsApp Button (only visible on desktop) */}
            <div className="hidden md:block">
              <a href="http://wa.me/212649150370" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg">
                <Phone className="h-4 w-4" />
                <span>{t('header.contact')}</span>
              </a>
            </div>

            {/* Favorites Button with Animation */}
            <Link to="/favorites" className="relative rounded-full p-2 flex items-center bg-transparent">
              <div className="relative">
                <Heart className={`h-5 w-5 text-red-500 transition-all duration-300 ${favoriteAnimating ? 'animate-bounce scale-125' : ''} ${favorites.length > 0 ? 'fill-current' : ''}`} />
                {favorites.length > 0 && <span className={`absolute ${isRTL ? '-top-2 -left-2' : '-top-2 -right-2'} flex items-center justify-center bg-red-500 text-white rounded-full w-4 h-4 text-xs font-bold shadow-sm transition-all duration-300 ${favoriteAnimating ? 'animate-pulse scale-110' : ''}`}>
                    {favorites.length}
                  </span>}
              </div>
              <span className="text-red-500 font-semibold ml-2 hidden md:inline-block">
                {t('header.favorites')}
              </span>
            </Link>
            
            {/* Cart Button */}
            <button onClick={handleCartClick} className="relative rounded-full p-2 flex items-center bg-transparent" aria-label="View cart">
              <div className="relative">
                <ShoppingCart className={`h-5 w-5 text-green-600 transition-all duration-300 ease-in-out ${isAnimating ? 'animate-bounce scale-125' : ''}`} />
                {getTotalItems() > 0 && <span className={`absolute ${isRTL ? '-top-2 -left-2' : '-top-2 -right-2'} flex items-center justify-center bg-red-500 text-white rounded-full w-4 h-4 text-xs font-bold shadow-sm transition-all duration-200 ease-in-out ${quantityAnimating ? 'animate-pulse scale-110' : ''}`}>
                    {getTotalItems()}
                  </span>}
              </div>
              <span className={`text-green-600 font-semibold ${isRTL ? 'mr-2' : 'ml-2'} hidden md:inline-block`}>
                {t('header.cart')}
              </span>
            </button>
          </div>
        </div>
        
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </header>
      
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>;
};

export default Header;
