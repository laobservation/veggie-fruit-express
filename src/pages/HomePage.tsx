import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsWithStock } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { fixProductImportType } from '@/services/productService';
import { Product } from '@/types/product';
import PromotionSlider from '@/components/home/PromotionSlider';
import CategoriesSection from '@/components/home/CategoriesSection';
import PopularItemsSection from '@/components/home/PopularItemsSection';
import NewArrivalSection from '@/components/home/NewArrivalSection';
const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getProductsWithStock();

        // Fix product types to ensure compatibility
        setProducts(fixProductImportType(products));
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Unable to load products.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);
  return <div className="bg-gray-50 min-h-screen pb-28 md:pb-6 py-0 px-0">
      {/* Promotions Slider - Uses the slider data from database */}
      <PromotionSlider />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Popular Items Section */}
      <PopularItemsSection products={products} isLoading={isLoading} />
      
      {/* New Arrivals Section - Only show if there are enough products */}
      {products.length > 6 && <NewArrivalSection products={products} isLoading={isLoading} />}
    </div>;
};
export default HomePage;