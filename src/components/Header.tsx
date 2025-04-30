
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-veggie-primary text-white p-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/>
              <path d="M10 2c1 .5 2 2 2 5"/>
            </svg>
          </span>
          <span className="text-xl font-bold text-veggie-dark">Veggie Express</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-veggie-primary font-medium">Accueil</Link>
          <Link to="/fruits" className="text-gray-700 hover:text-veggie-primary font-medium">Fruits</Link>
          <Link to="/vegetables" className="text-gray-700 hover:text-veggie-primary font-medium">Légumes</Link>
        </nav>
        
        <div className="flex items-center gap-4">
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
    </header>
  );
};

export default Header;
