
import { Link } from 'react-router-dom';
import { getCategoryLinkedProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { transformProductFromSupabase } from '@/services/productService';
import { Product } from '@/types/product';

interface CategoryBannerProps {
  category: 'fruit' | 'vegetable';
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ category }) => {
  const [linkedProducts, setLinkedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchCategoryLinkedProducts = async () => {
      try {
        // Fetch products from Supabase that are linked to this category
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('category', category)
          .eq('link_to_category', true);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Ensure the data includes the featured property before transforming
          const productsWithFeatured = data.map(product => ({
            ...product,
            featured: product.featured !== null ? product.featured : false
          }));
          
          // Transform Supabase products to our Product type
          const products = productsWithFeatured.map(product => transformProductFromSupabase(product));
          setLinkedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching category linked products:', error);
      }
    };
    
    fetchCategoryLinkedProducts();
  }, [category]);
  
  return (
    <div 
      className={`relative h-40 md:h-60 w-full rounded-lg overflow-hidden mb-8 bg-cover bg-center`}
      style={{ backgroundImage: `url('/images/${category}-banner.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {category === 'fruit' ? 'Fresh Fruits' : 'Organic Vegetables'}
        </h2>
        <p className="text-white text-lg md:text-xl mb-4">
          {category === 'fruit' 
            ? 'Sweet and juicy fruits freshly harvested' 
            : 'Farm-fresh vegetables for your healthy diet'}
        </p>
        <Link 
          to={`/${category}s`} 
          className="bg-white text-veggie-primary hover:bg-veggie-primary hover:text-white transition-colors px-6 py-2 rounded-md font-medium"
        >
          Browse All {category === 'fruit' ? 'Fruits' : 'Vegetables'}
        </Link>
        
        {linkedProducts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {linkedProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="bg-white/80 text-veggie-dark hover:bg-veggie-primary hover:text-white transition-colors px-3 py-1 rounded-md text-sm"
              >
                {product.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBanner;
