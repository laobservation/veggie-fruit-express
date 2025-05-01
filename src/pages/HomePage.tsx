
import React from 'react';
import Hero from '@/components/Hero';
import CategoryBanner from '@/components/CategoryBanner';
import CallToAction from '@/components/CallToAction';
import ProductGrid from '@/components/ProductGrid';
import CategoryCircles from '@/components/CategoryCircles';
import { Card, CardContent } from '@/components/ui/card';
import { getFeaturedProducts } from '@/data/products';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

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
        
        <CategoryCircles />
        
        <ProductGrid products={featuredProducts} title="Produits Vedettes" />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategoryBanner category="fruit" />
          <CategoryBanner category="vegetable" />
        </div>
      </div>
      
      <CallToAction />
    </div>
  );
};

export default HomePage;
