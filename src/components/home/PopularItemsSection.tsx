
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';

interface PopularItemsSectionProps {
  title: string;
  products: Product[];
  isLoading: boolean;
  showAll?: boolean;
  categoryName: string;
  onShowMore?: () => void;
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  title,
  products,
  isLoading,
  showAll = false,
  categoryName,
  onShowMore
}) => {
  console.log(`PopularItemsSection: Filtering products for category "${categoryName}"`);
  
  // Filter products by category name with comprehensive matching
  const categoryProducts = products.filter(product => {
    const productCategory = product.category?.toLowerCase().trim();
    const searchCategory = categoryName.toLowerCase().trim();
    
    // Must have categoryLink enabled to show on home page
    if (product.categoryLink !== true) return false;
    
    // Direct exact match
    if (productCategory === searchCategory) return true;
    
    // Handle common variations
    if ((searchCategory === 'légumes' || searchCategory === 'vegetable' || searchCategory === 'vegetables') && 
        (productCategory === 'légumes' || productCategory === 'vegetable' || productCategory === 'vegetables')) {
      return true;
    }
    
    if ((searchCategory === 'fruits' || searchCategory === 'fruit') && 
        (productCategory === 'fruits' || productCategory === 'fruit')) {
      return true;
    }
    
    if ((searchCategory === 'packs' || searchCategory === 'pack') && 
        (productCategory === 'packs' || productCategory === 'pack')) {
      return true;
    }
    
    if ((searchCategory === 'drinks' || searchCategory === 'boissons' || searchCategory === 'drink') && 
        (productCategory === 'drinks' || productCategory === 'drink' || productCategory === 'boissons')) {
      return true;
    }
    
    if (searchCategory === 'salade-jus' && productCategory === 'salade-jus') {
      return true;
    }
    
    // Handle special categories like "Légumes préparés"
    if (searchCategory === 'légumes préparés' && productCategory === 'légumes préparés') {
      return true;
    }
    
    return false;
  });
  
  console.log(`Found ${categoryProducts.length} products for category "${categoryName}":`, categoryProducts.map(p => p.name));
  
  const displayProducts = showAll ? categoryProducts : categoryProducts.slice(0, 6);
  
  // Don't render section if no products
  if (!isLoading && categoryProducts.length === 0) {
    console.log(`No products found for category "${categoryName}", not rendering section`);
    return null;
  }

  // Get category path for "View All" link
  const getCategoryPath = (categoryName: string) => {
    const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '-');
    return `/category/${encodeURIComponent(normalizedName)}`;
  };

  return (
    <section className="py-6 px-4 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {!showAll && categoryProducts.length > 6 && (
          <Link 
            to={getCategoryPath(categoryName)}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            Voir tout
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
      
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
      ) : displayProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun produit trouvé dans cette catégorie.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {displayProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
          
          {!showAll && categoryProducts.length > 6 && onShowMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onShowMore}
                className="relative inline-flex items-center px-8 py-3 text-white font-semibold rounded-lg
                         bg-gradient-to-br from-green-500 via-green-600 to-green-700
                         shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40
                         transform hover:scale-105 active:scale-95 transition-all duration-200
                         border border-green-400/30 hover:border-green-300/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Afficher plus
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default PopularItemsSection;
