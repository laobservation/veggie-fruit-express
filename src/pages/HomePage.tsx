
import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import CategoryBanner from '@/components/CategoryBanner';
import CallToAction from '@/components/CallToAction';
import ProductGrid from '@/components/ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import { getProductsWithStock } from '@/data/products';
import Cart from '@/components/Cart';
import { useToast } from '@/hooks/use-toast';
import { fixProductImportType } from '@/services/productService';

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
        // Note: Since featured is a clientside-only field, we can't filter by it in the database
        // so we need to do it here in the UI
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
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12 bg-gradient-to-r from-veggie-light to-white border-none shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-veggie-dark">Bienvenue à Notre Marché Bio</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de fruits et légumes frais, cultivés localement et livrés directement chez vous.
              Nous sommes fiers de vous offrir des produits de qualité supérieure pour votre santé.
            </p>
          </CardContent>
        </Card>
        
        <ProductGrid 
          products={featuredProducts} 
          title="Produits Vedettes" 
          isLoading={isLoading}
        />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategoryBanner category="fruit" />
          <CategoryBanner category="vegetable" />
        </div>
      </div>
      
      <CallToAction />
      <Cart />
    </div>
  );
};

export default HomePage;
