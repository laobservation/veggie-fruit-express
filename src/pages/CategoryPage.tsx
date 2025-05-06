
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { supabase } from '@/integrations/supabase/client';
import { transformProductFromSupabase } from '@/services/productService';
import { Product } from '@/types/product';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const categoryConfig = {
    fruits: {
      title: 'Fresh Fruits',
      description: 'Explore our selection of fresh, juicy fruits sourced directly from local farms.',
      bgClass: 'bg-red-100'
    },
    vegetables: {
      title: 'Organic Vegetables',
      description: 'Browse our selection of farm-fresh, organic vegetables.',
      bgClass: 'bg-green-100'
    },
    packs: {
      title: 'Value Packs',
      description: 'Get more for your money with our specially curated value packs.',
      bgClass: 'bg-amber-100'
    },
    drinks: {
      title: 'Healthy Drinks',
      description: 'Refresh yourself with our selection of healthy and natural drinks.',
      bgClass: 'bg-blue-100'
    }
  };

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setIsLoading(true);
      try {
        // Normalize the category ID for database query (singular form)
        let dbCategory = categoryId;
        if (categoryId === 'fruits') dbCategory = 'fruit';
        if (categoryId === 'vegetables') dbCategory = 'vegetable';
        if (categoryId === 'packs') dbCategory = 'pack';
        if (categoryId === 'drinks') dbCategory = 'drink';
        
        // Set page title and description
        const config = categoryConfig[categoryId as keyof typeof categoryConfig] || {
          title: 'Products',
          description: 'Browse our selection of products.',
          bgClass: 'bg-gray-100'
        };
        
        setCategoryName(config.title);
        setCategoryDescription(config.description);

        // Fetch products linked to this category
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('category', dbCategory)
          .eq('link_to_category', true);
        
        if (error) {
          throw error;
        }
        
        // Transform the products
        if (data && data.length > 0) {
          const categoryProducts = data.map(product => transformProductFromSupabase(product));
          setProducts(categoryProducts);
        } else {
          console.log('No products found for category:', categoryId);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className={`py-12 ${categoryConfig[categoryId as keyof typeof categoryConfig]?.bgClass || 'bg-gray-100'}`}>
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{categoryName}</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              {categoryDescription}
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
