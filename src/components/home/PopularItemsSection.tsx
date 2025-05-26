
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
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  title,
  products,
  isLoading,
  showAll = false,
  category
}) => {
  console.log(`PopularItemsSection: Filtering products for category "${category}"`);
  console.log('All products:', products.map(p => ({ id: p.id, name: p.name, category: p.category, categoryLink: p.categoryLink })));
  
  // Filter products by category and only show products with categoryLink = true
  const categoryProducts = products.filter(product => {
    const matchesCategory = product.category === category;
    const hasCategoryLink = product.categoryLink === true;
    
    console.log(`Product ${product.name}: category=${product.category}, matches=${matchesCategory}, categoryLink=${product.categoryLink}, hasCategoryLink=${hasCategoryLink}`);
    
    return matchesCategory && hasCategoryLink;
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
    switch(category) {
      case 'fruit': return '/category/fruits';
      case 'vegetable': return '/category/légumes';
      case 'pack': return '/category/packs';
      case 'drink': return '/category/drinks';
      case 'salade-jus': return '/category/salade-jus';
      default: return '/';
    }
  };

  return (
    <section className="py-6 px-4 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {!showAll && categoryProducts.length > 6 && (
          <Link 
            to={getCategoryPath(category)}
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularItemsSection;
