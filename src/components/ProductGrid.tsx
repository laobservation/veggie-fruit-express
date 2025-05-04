
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, isLoading = false }) => {
  return (
    <section className="py-6">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-square"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} discountPercentage={20} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
