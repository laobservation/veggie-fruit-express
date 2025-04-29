
import React from 'react';
import Hero from '@/components/Hero';
import CategoryBanner from '@/components/CategoryBanner';
import CallToAction from '@/components/CallToAction';
import ProductGrid from '@/components/ProductGrid';
import { getFeaturedProducts } from '@/data/products';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <ProductGrid products={featuredProducts} title="Featured Products" />
        
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
