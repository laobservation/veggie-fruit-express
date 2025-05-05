
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

// Mobile Bottom Navigation component
const MobileBottomNav = () => {
  const { getTotalItems, openCart } = useCart();
  const location = useLocation();
  
  // Hide on thank you page
  if (location.pathname === '/thank-you') {
    return null;
  }
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top flex justify-around py-2 border-t z-50">
      <Link to="/" className="flex flex-col items-center p-2">
        <Home className="h-5 w-5 text-green-500" />
        <span className="text-xs text-gray-600 mt-1">Home</span>
      </Link>
      <Link to="/favorites" className="flex flex-col items-center p-2">
        <Heart className="h-5 w-5 text-gray-500" />
        <span className="text-xs text-gray-600 mt-1">Favorites</span>
      </Link>
      <button 
        onClick={openCart}
        className="flex flex-col items-center p-2 relative"
      >
        <ShoppingCart className="h-5 w-5 text-gray-500" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {getTotalItems()}
          </span>
        )}
        <span className="text-xs text-gray-600 mt-1">Cart</span>
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
    </CartNotificationProvider>
  );
}

export default App;
