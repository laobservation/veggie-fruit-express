
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
    </CartNotificationProvider>
  );
}

export default App;
