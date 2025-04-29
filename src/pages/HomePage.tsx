
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategoryBanner from '@/components/CategoryBanner';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';
import { getFeaturedProducts, getProductsByCategory } from '@/data/products';

const HomePage = () => {
  const featuredProducts = getFeaturedProducts();
  const fruits = getProductsByCategory('fruit').slice(0, 4);
  const vegetables = getProductsByCategory('vegetable').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <div className="container mx-auto px-4 py-8">
          <ProductGrid products={featuredProducts} title="Featured Products" />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <CategoryBanner category="fruit" />
            <CategoryBanner category="vegetable" />
          </div>
          
          <ProductGrid products={fruits} title="Fresh Fruits" />
          <ProductGrid products={vegetables} title="Organic Vegetables" />
        </div>
        
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
