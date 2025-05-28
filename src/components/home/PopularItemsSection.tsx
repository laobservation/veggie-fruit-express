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
  category: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus';
  onShowMore?: () => void;
}
const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  title,
  products,
  isLoading,
  showAll = false,
  category,
  onShowMore
}) => {
  console.log(`PopularItemsSection: Filtering products for category "${category}"`);
  console.log('All products:', products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    categoryLink: p.categoryLink
  })));

  // Strict category filtering - only exact matches with categoryLink = true
  const categoryProducts = products.filter(product => {
    const exactCategoryMatch = product.category === category;
    const shouldShowOnHomePage = product.categoryLink === true;
    console.log(`Product ${product.name}: category=${product.category}, exactMatch=${exactCategoryMatch}, categoryLink=${product.categoryLink}, shouldShow=${shouldShowOnHomePage}`);
    return exactCategoryMatch && shouldShowOnHomePage;
  });
  console.log(`Found ${categoryProducts.length} products for category "${category}":`, categoryProducts.map(p => p.name));

  // Limit products if not showing all
  const displayProducts = showAll ? categoryProducts : categoryProducts.slice(0, 6);

  // Don't render section if no products
  if (!isLoading && categoryProducts.length === 0) {
    console.log(`No products found for category "${category}", not rendering section`);
    return null;
  }

  // Get category path for "View All" link
  const getCategoryPath = (category: string) => {
    switch (category) {
      case 'fruit':
        return '/category/fruits';
      case 'vegetable':
        return '/category/légumes';
      case 'pack':
        return '/category/packs';
      case 'drink':
        return '/category/drinks';
      case 'salade-jus':
        return '/category/salade-jus';
      default:
        return '/';
    }
  };
  return <section className="py-6 px-4 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-2xl text-gray-900 text-xl font-normal">{title}</h2>
        {!showAll && categoryProducts.length > 6 && <Link to={getCategoryPath(category)} className="flex items-center text-green-600 hover:text-green-700 font-medium">
            Voir tout
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>}
      </div>
      
      {isLoading ? <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>)}
        </div> : displayProducts.length === 0 ? <p className="text-center text-gray-500 py-8">Aucun produit trouvé dans cette catégorie.</p> : <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {displayProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          
          {/* Show More Button - Only show if there are more products to display and we're not showing all */}
          {!showAll && categoryProducts.length > 6 && onShowMore && <div className="flex justify-center mt-6">
              <button onClick={onShowMore} className="relative inline-flex items-center px-8 py-3 text-white font-semibold rounded-lg
                         bg-gradient-to-br from-green-500 via-green-600 to-green-700
                         shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40
                         transform hover:scale-105 active:scale-95 transition-all duration-200
                         border border-green-400/30 hover:border-green-300/50
                         before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r 
                         before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100
                         before:transition-opacity before:duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Afficher plus
                  <ChevronRight className="w-4 h-4" />
                </span>
                {/* 3D effect highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-lg"></div>
              </button>
            </div>}
        </>}
    </section>;
};
export default PopularItemsSection;