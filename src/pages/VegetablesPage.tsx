
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory } from '@/data/products';

const VegetablesPage = () => {
  const vegetables = getProductsByCategory('vegetable');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-veggie-light py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Organic Vegetables</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Browse our selection of farm-fresh, organic vegetables. Each item is carefully 
              handpicked to ensure you receive only the best quality produce.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <ProductGrid products={vegetables} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VegetablesPage;
