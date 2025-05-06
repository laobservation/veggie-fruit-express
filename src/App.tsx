
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import FruitsPage from './pages/FruitsPage';
import VegetablesPage from './pages/VegetablesPage';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminSliderPage from './pages/AdminSliderPage';
import AdminTranslationsPage from './pages/AdminTranslationsPage';
import ThankYouPage from './pages/ThankYouPage';
import { TranslationsProvider } from './hooks/use-translations';
import './App.css';

const App: React.FC = () => {
  return (
    <TranslationsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/fruits" element={<FruitsPage />} />
          <Route path="/vegetables" element={<VegetablesPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/slider" element={<AdminSliderPage />} />
          <Route path="/admin/translations" element={<AdminTranslationsPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-right" expand={false} />
      </Router>
    </TranslationsProvider>
  );
};

export default App;
