
import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/use-categories';
import { getProductsWithStock } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { fixProductImportType } from '@/services/productService';
import { Product } from '@/types/product';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import PromotionSlider from '@/components/home/PromotionSlider';
import CategoriesSection from '@/components/home/CategoriesSection';
import PopularItemsSection from '@/components/home/PopularItemsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

interface HomeSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  robots_directives: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seo, setSeo] = useState<HomeSEO | null>(null);
  const [showMoreItems, setShowMoreItems] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();

  // Load SEO settings
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('route', '/')
          .eq('page_slug', 'home')
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching home SEO:', error);
          return;
        }
        
        if (data) {
          setSeo({
            meta_title: data.meta_title || 'Marché Bio - Fruits et Légumes Bio',
            meta_description: data.meta_description || 'Livraison de fruits et légumes bio à domicile',
            meta_keywords: data.meta_keywords || 'fruits bio, légumes bio, livraison, maroc',
            canonical_url: data.canonical_url || window.location.href,
            robots_directives: data.robots_directives || 'index, follow',
            og_title: data.og_title || 'Marché Bio - Fruits et Légumes Bio',
            og_description: data.og_description || 'Livraison de fruits et légumes bio à domicile',
            og_image: data.og_image || '',
            og_url: data.og_url || window.location.href,
          });
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      }
    };
    
    fetchSEO();
  }, []);

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getProductsWithStock();
        const fixedProducts = fixProductImportType(products);
        console.log('Loaded products:', fixedProducts);
        setProducts(fixedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Unable to load products.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Get visible categories that have products
  const getVisibleCategoriesWithProducts = () => {
    return categories.filter(category => {
      // Only show visible categories
      if (!category.is_visible) return false;
      
      // Check if category has products
      const categoryProducts = products.filter(product => {
        // Match by exact category name or similar variations
        const productCategory = product.category?.toLowerCase().trim();
        const categoryName = category.name.toLowerCase().trim();
        
        // Direct match
        if (productCategory === categoryName) return product.categoryLink === true;
        
        // Handle variations
        if ((categoryName === 'légumes' || categoryName === 'vegetable') && 
            (productCategory === 'légumes' || productCategory === 'vegetable')) {
          return product.categoryLink === true;
        }
        
        if ((categoryName === 'fruits' || categoryName === 'fruit') && 
            (productCategory === 'fruits' || productCategory === 'fruit')) {
          return product.categoryLink === true;
        }
        
        if ((categoryName === 'packs' || categoryName === 'pack') && 
            (productCategory === 'packs' || productCategory === 'pack')) {
          return product.categoryLink === true;
        }
        
        if ((categoryName === 'drinks' || categoryName === 'boissons') && 
            (productCategory === 'drinks' || productCategory === 'drink')) {
          return product.categoryLink === true;
        }
        
        if (categoryName === 'salade-jus' && productCategory === 'salade-jus') {
          return product.categoryLink === true;
        }
        
        // For special categories like "Légumes préparés"
        if (categoryName === 'légumes préparés' && productCategory === 'légumes préparés') {
          return product.categoryLink === true;
        }
        
        return false;
      });
      
      return categoryProducts.length > 0;
    });
  };

  const visibleCategoriesWithProducts = getVisibleCategoriesWithProducts();

  const handleShowMore = (categoryId: string) => {
    setShowMoreItems(prev => ({
      ...prev,
      [categoryId]: true
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-28 md:pb-6 py-0 px-0">
      {/* SEO Metadata */}
      {seo && (
        <Helmet>
          {seo.meta_title && <title>{seo.meta_title}</title>}
          {seo.meta_description && <meta name="description" content={seo.meta_description} />}
          {seo.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}
          {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
          {seo.robots_directives && <meta name="robots" content={seo.robots_directives} />}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          
          {/* Open Graph / Facebook */}
          {seo.og_title && <meta property="og:title" content={seo.og_title} />}
          {seo.og_description && <meta property="og:description" content={seo.og_description} />}
          {seo.og_image && <meta property="og:image" content={seo.og_image} />}
          {seo.og_url && <meta property="og:url" content={seo.og_url} />}
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <PromotionSlider />
      <CategoriesSection />

      {/* Render sections for visible categories with products */}
      {visibleCategoriesWithProducts.map((category) => (
        <PopularItemsSection
          key={category.id}
          title={category.name}
          products={products}
          isLoading={isLoading}
          showAll={showMoreItems[category.id] || false}
          categoryName={category.name}
          onShowMore={() => handleShowMore(category.id)}
        />
      ))}

      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
