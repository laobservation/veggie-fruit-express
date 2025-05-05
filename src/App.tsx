
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
import { Toaster } from "@/components/ui/toaster";
import FavoritesPage from '@/pages/FavoritesPage';
import Cart from '@/components/Cart';

function App() {
  return (
    <CartNotificationProvider>
      <div className="flex flex-col min-h-screen">
        <Toaster />
        <div className="flex-grow">
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
        </div>
        <Cart />
      </div>
    </CartNotificationProvider>
  );
}

export default App;
