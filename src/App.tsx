
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import ProductPage from '@/pages/ProductPage';
import FruitsPage from '@/pages/FruitsPage';
import VegetablesPage from '@/pages/VegetablesPage';
import ThankYouPage from '@/pages/ThankYouPage';
import NotFound from '@/pages/NotFound';
import AdminPage from '@/pages/AdminPage';
import { CartNotificationProvider } from '@/hooks/use-cart';
import { Toaster } from "@/components/ui/toaster"
import FavoritesPage from '@/pages/FavoritesPage';
import { Home, Heart, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import Cart from '@/components/Cart';
import { useFavorites } from '@/hooks/use-favorites';

// Mobile Bottom Navigation component
const MobileBottomNav = () => {
  const { getTotalItems, openCart } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();
  
  // Hide on thank you page
  if (location.pathname === '/thank-you') {
    return null;
  }
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top flex justify-around py-3 border-t z-50">
      <Link to="/" className="flex flex-col items-center">
        <div className="bg-green-50 rounded-full p-2">
          <Home className="h-5 w-5 text-green-600 stroke-[2.5px]" />
        </div>
        <span className="text-xs font-medium text-gray-800 mt-1">Home</span>
      </Link>
      <Link to="/favorites" className="flex flex-col items-center relative">
        <div className="bg-red-50 rounded-full p-2">
          <Heart className="h-5 w-5 text-red-500 stroke-[2.5px]" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {favorites.length}
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-gray-800 mt-1">Favorites</span>
      </Link>
      <button 
        onClick={openCart}
        className="flex flex-col items-center relative"
      >
        <div className="bg-green-50 rounded-full p-2">
          <ShoppingCart className="h-5 w-5 text-green-600 stroke-[2.5px]" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-gray-800 mt-1">Cart</span>
      </button>
    </div>
  );
};

function App() {
  return (
    <CartNotificationProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/fruits" element={<FruitsPage />} />
        <Route path="/vegetables" element={<VegetablesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileBottomNav />
      <Cart />
    </CartNotificationProvider>
  );
}

export default App;
