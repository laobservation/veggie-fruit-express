import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import ProductPage from '@/pages/ProductPage';
import CategoryPage from '@/pages/CategoryPage';
import ThankYouPage from '@/pages/ThankYouPage';
import NotFound from '@/pages/NotFound';
import AdminPage from '@/pages/AdminPage';
import AdminAuthPage from '@/pages/AdminAuthPage';
import AdminSliderPage from '@/pages/AdminSliderPage';
import AdminSettingsPage from '@/pages/AdminSettingsPage';
import AdminTestimonialsPage from '@/pages/AdminTestimonialsPage';
import PriceManagementPage from '@/pages/PriceManagementPage';
import { CartNotificationProvider } from '@/hooks/use-cart';
import { Toaster } from "@/components/ui/sonner";
import FavoritesPage from '@/pages/FavoritesPage';
import Cart from '@/components/Cart';
import SocialMediaSticky from '@/components/SocialMediaSticky';
import AuthPage from '@/pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <CartNotificationProvider>
        <div className="flex flex-col min-h-screen">
          <Toaster position="bottom-right" />
          <SocialMediaSticky />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/product/:productId/:slug" element={<ProductPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              
              {/* Authentication Routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin-auth" element={<Navigate to="/auth" replace />} />
              
              {/* Protected Admin Routes - now using AdminRouteGuard */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/slider" element={<AdminSliderPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
              <Route path="/prix" element={<PriceManagementPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Cart />
        </div>
      </CartNotificationProvider>
    </AuthProvider>
  );
}

export default App;
