
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FruitsPage from "./pages/FruitsPage";
import VegetablesPage from "./pages/VegetablesPage";
import ProductPage from "./pages/ProductPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import { CartNotificationProvider } from "@/hooks/use-cart";

// Creating placeholder pages for new routes
const DrinksPage = () => <div className="p-8">Drinks Page Coming Soon</div>;
const SnacksPage = () => <div className="p-8">Snacks Page Coming Soon</div>;
const SearchPage = () => <div className="p-8">Search Page Coming Soon</div>;
const ProfilePage = () => <div className="p-8">Profile Page Coming Soon</div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartNotificationProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/fruits" element={<FruitsPage />} />
            <Route path="/vegetables" element={<VegetablesPage />} />
            <Route path="/drinks" element={<DrinksPage />} />
            <Route path="/snacks" element={<SnacksPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartNotificationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
