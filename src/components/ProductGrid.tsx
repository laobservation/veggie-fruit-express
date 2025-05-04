
import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, isLoading = false }) => {
  return (
    <section className="py-8">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
