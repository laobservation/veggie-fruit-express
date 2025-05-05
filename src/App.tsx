
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import ProductPage from '@/pages/ProductPage';
import NotFound from '@/pages/NotFound';
import FavoritesPage from '@/pages/FavoritesPage';
import ThankYouPage from '@/pages/ThankYouPage';
import AdminPage from '@/pages/AdminPage';
import { CartNotificationProvider } from '@/hooks/use-cart';
import Cart from '@/components/Cart';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [mounted, setMounted] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <CartNotificationProvider>
        <div className="app min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Cart />
        </div>
        <Toaster />
      </CartNotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
