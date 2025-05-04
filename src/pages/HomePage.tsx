
import React, { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getProductsWithStock } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { fixProductImportType } from '@/services/productService';
import { CategoryNavigation } from '@/components/CategoryNavigation';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getProductsWithStock();
        
        // Filter out featured products
        const featured = products.filter((product) => product.featured);
        
        // Fix product types to ensure compatibility
        setFeaturedProducts(fixProductImportType(featured));
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-yellow-400 rounded-lg overflow-hidden mx-4 my-4">
        <div className="flex items-center">
          <div className="p-4 flex-1">
            <h1 className="text-2xl font-bold text-white">Shop Smarter,<br/>Save More!</h1>
            <button className="mt-3 bg-white text-yellow-500 rounded-full px-4 py-2 text-sm font-medium">
              Get 40% Off
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/lovable-uploads/6f3cacf5-5377-47c9-8cba-3837c17f4d36.png"
              alt="Shop Smart"
              className="h-32 object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mx-4 my-4">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search product..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="absolute right-2 p-1 bg-gray-100 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mx-4 my-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Categories</h2>
          <a href="#" className="text-sm text-gray-500">See All</a>
        </div>
        <CategoryNavigation />
      </div>
      
      <div className="container mx-auto px-4 py-2">
        <ProductGrid 
          products={featuredProducts.slice(0, 4)} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default HomePage;
