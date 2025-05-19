
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductGridProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title, isLoading = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-6 w-full">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              discountPercentage={0} // Default to 0 since 'discount' doesn't exist on Product
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
