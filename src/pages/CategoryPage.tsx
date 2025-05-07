
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import { transformProductFromSupabase } from '@/services/productService';
import { Product } from '@/types/product';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [bgClass, setBgClass] = useState('bg-gray-100');

  useEffect(() => {
    // Get category information from database
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      try {
        const { data, error } = await getCategoriesTable()
          .select('*')
          .ilike('name', categoryId)
          .single();
          
        if (error) {
          console.error('Error fetching category:', error);
          // Use fallback
          setFallbackCategoryInfo();
          return;
        }
        
        if (data) {
          setCategoryName(data.name);
          // Generic descriptions based on category name
          setCategoryDescription(`Browse our selection of ${data.name.toLowerCase()}.`);
          setBgClass(data.background_color || 'bg-gray-100');
        } else {
          // No matching category found, use fallback
          setFallbackCategoryInfo();
        }
      } catch (error) {
        console.error('Error in category fetch:', error);
        setFallbackCategoryInfo();
      }
    };
    
    const setFallbackCategoryInfo = () => {
      // Use fallback category info based on URL
      const config = categoryConfig[categoryId as keyof typeof categoryConfig] || {
        title: categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Products',
        description: 'Browse our selection of products.',
        bgClass: 'bg-gray-100'
      };
      
      setCategoryName(config.title);
      setCategoryDescription(config.description);
      setBgClass(config.bgClass);
    };
    
    fetchCategory();
    fetchProductsByCategory();
    
    // Listen for category changes
    const categoriesChannel = supabase
      .channel('category-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          console.log('CategoryPage: Detected category change, refreshing...');
          fetchCategory();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(categoriesChannel);
    };
  }, [categoryId]);

  // Default category configurations as fallback
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

  const fetchProductsByCategory = async () => {
    setIsLoading(true);
    try {
      // Normalize the category ID for database query (singular form)
      let dbCategory = categoryId;
      if (categoryId === 'fruits') dbCategory = 'fruit';
      if (categoryId === 'vegetables') dbCategory = 'vegetable';
      if (categoryId === 'packs') dbCategory = 'pack';
      if (categoryId === 'drinks') dbCategory = 'drink';
      
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className={`py-12 ${bgClass}`}>
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
    </div>
  );
};

export default CategoryPage;
