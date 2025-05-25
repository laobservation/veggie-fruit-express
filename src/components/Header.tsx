
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Menu, Phone, Heart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchBar from './SearchBar';
import { useFavorites } from '@/hooks/use-favorites';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  path: string;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantityAnimating, setQuantityAnimating] = useState(false);
  const [favoriteAnimating, setFavoriteAnimating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const {
    getTotalItems,
    openCart,
    isCartOpen,
    closeCart
  } = useCart();
  const {
    favorites
  } = useFavorites();
  const isMobile = useIsMobile();

  // Fetch categories for desktop navigation
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('is_visible', true)
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        const formattedCategories = data.map(cat => {
          let pathName = cat.name.toLowerCase().replace(/\s+/g, '-');
          
          // Special handling for consistent URL structure
          if (pathName === 'fruit') pathName = 'fruits';
          if (pathName === 'vegetable' || pathName === 'légume') pathName = 'légumes';
          if (pathName === 'pack') pathName = 'packs';
          if (pathName === 'drink') pathName = 'drinks';
          
          return {
            id: cat.id,
            name: cat.name,
            path: `/category/${pathName}`
          };
        });
        
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
  
  return <>
      <header className="bg-white sticky top-0 z-50 shadow-sm py-[19px]">
        <div className="container mx-auto px-4 flex items-center justify-between relative">
          <div className="flex items-center gap-6">
            {isMobile && <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mr-2 relative z-50 px-0 py-0 mx-[4px] my-0 bg-transparent">
                {!isMobileMenuOpen ? <Menu className="h-6 w-6 text-gray-700 mx-0 my-0 px-0 py-0 text-base font-semibold" /> : <span className="h-6 w-6 text-gray-700">✕</span>}
                <span className="sr-only">Menu</span>
              </Button>}
            
            {/* Categories dropdown for desktop */}
            {!isMobile && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-semibold transition-colors"
                >
                  Catégories
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showCategoriesDropdown && (
                  <div
                    onMouseEnter={() => setShowCategoriesDropdown(true)}
                    onMouseLeave={() => setShowCategoriesDropdown(false)}
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md border py-2 min-w-[200px] z-50"
                  >
                    {categories.map(category => (
                      <Link
                        key={category.id}
                        to={category.path}
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setShowCategoriesDropdown(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
              <img src="/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png" alt="Marché Bio Logo" loading="eager" fetchPriority="high" className="h-14 w-auto object-contain" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block max-w-md">
              <SearchBar />
            </div>
            
            {/* WhatsApp Button (only visible on desktop) */}
            <div className="hidden md:block">
              <a href="http://wa.me/212649150370" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
            </div>

            {/* Favorites Button */}
            <Link to="/favorites" className="relative rounded-full p-2 flex items-center bg-transparent">
              <div className="relative">
                <Heart className={`h-5 w-5 text-red-500 transition-all duration-300 ${favoriteAnimating ? 'animate-bounce scale-125' : ''} ${favorites.length > 0 ? 'fill-current' : ''}`} />
                {favorites.length > 0 && <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white rounded-full w-4 h-4 text-xs font-bold shadow-sm">
                    {favorites.length}
                  </span>}
              </div>
              <span className="text-red-500 font-semibold ml-2 hidden md:inline-block">
                Favoris
              </span>
            </Link>
            
            {/* Cart Button */}
            <button onClick={handleCartClick} className="relative rounded-full p-2 flex items-center bg-transparent" aria-label="View cart">
              <div className="relative">
                <ShoppingCart className={`h-5 w-5 text-green-600 transition-all duration-300 ease-in-out ${isAnimating ? 'animate-bounce scale-125' : ''}`} />
                {getTotalItems() > 0 && <span className={`absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white rounded-full w-4 h-4 text-xs font-bold shadow-sm transition-all duration-200 ease-in-out ${quantityAnimating ? 'animate-pulse scale-110' : ''}`}>
                    {getTotalItems()}
                  </span>}
              </div>
              <span className="text-green-600 font-semibold ml-2 hidden md:inline-block">
                Panier
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
