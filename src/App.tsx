
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import ProductPage from '@/pages/ProductPage';
import CategoryPage from '@/pages/CategoryPage';
import ThankYouPage from '@/pages/ThankYouPage';
import NotFound from '@/pages/NotFound';
import AdminPage from '@/pages/AdminPage';
import AdminAuthPage from '@/pages/AdminAuthPage';
import AdminSliderPage from '@/pages/AdminSliderPage';
import AdminSettingsPage from '@/pages/AdminSettingsPage';
import { CartNotificationProvider } from '@/hooks/use-cart';
import { Toaster } from "@/components/ui/sonner";
import FavoritesPage from '@/pages/FavoritesPage';
import Cart from '@/components/Cart';
import SocialMediaSticky from '@/components/SocialMediaSticky';

// Admin Route Protection Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to admin login page, but save the intended destination
    return <Navigate to="/admin-auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
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
            <Route path="/admin-auth" element={<AdminAuthPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/slider" element={
              <ProtectedAdminRoute>
                <AdminSliderPage />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedAdminRoute>
                <AdminSettingsPage />
              </ProtectedAdminRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Cart />
      </div>
    </CartNotificationProvider>
  );
}

export default App;
