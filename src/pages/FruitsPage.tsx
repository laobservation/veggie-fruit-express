
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory } from '@/data/products';

const FruitsPage = () => {
  const fruits = getProductsByCategory('fruit');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-veggie-light py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Fresh Fruits</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Explore our selection of fresh, juicy fruits sourced directly from local farms. 
              Add your favorites to your cart and enjoy same-day delivery.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <ProductGrid products={fruits} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FruitsPage;
