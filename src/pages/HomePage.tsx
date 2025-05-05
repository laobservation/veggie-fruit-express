
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
import Header from '@/components/Header';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
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
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Featured promotions for the slider
  const promotions = [
    {
      id: 1,
      title: "MEAL PLAN WITH GROCERY STORE",
      color: "bg-emerald-800",
      image: "/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png"
    },
    {
      id: 2,
      title: "MAKING THE MOST OF YOUR GROCERY",
      color: "bg-purple-700",
      image: "/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png"
    },
    {
      id: 3,
      title: "SHOPPING WITH GROCERY STORE",
      color: "bg-teal-700",
      image: "/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png"
    }
  ];

  return (
    <div className="bg-gray-50 py-4 min-h-screen pb-28 md:pb-6">
      {/* Promotions Slider */}
      <PromotionSlider promotions={promotions} />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Popular Items Section */}
      <PopularItemsSection products={products} isLoading={isLoading} />

      {/* New Arrival Section */}
      <NewArrivalSection products={products} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
