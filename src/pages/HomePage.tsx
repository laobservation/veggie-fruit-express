
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
import CustomerExperienceSection from '@/components/home/CustomerExperienceSection';

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
        // Fix product types to ensure compatibility
        setProducts(fixProductImportType(products));
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

  // Map categories from database format to our application format, filtering out hidden categories
  const visibleCategories = categories.filter(cat => cat.is_visible !== false);
  
  const mappedCategories = visibleCategories.map(cat => {
    let categoryValue: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus' = 'vegetable';
    
    // Convert the category name to a value that matches our Product type
    const lowerName = cat.name.toLowerCase();
    if (lowerName.includes('fruit')) categoryValue = 'fruit';
    else if (lowerName.includes('légume') || lowerName.includes('legume') || lowerName.includes('vegetable')) categoryValue = 'vegetable';
    else if (lowerName.includes('pack')) categoryValue = 'pack';
    else if (lowerName.includes('boisson') || lowerName.includes('drink')) categoryValue = 'drink';
    else if (lowerName.includes('salade') || lowerName.includes('jus')) categoryValue = 'salade-jus';
    
    return {
      ...cat,
      categoryValue
    };
  });

  // Default categories if none are found in database
  const defaultCategories = [
    { id: 'fruits', name: 'Fruits', categoryValue: 'fruit' as const },
    { id: 'vegetables', name: 'Légumes', categoryValue: 'vegetable' as const },
    { id: 'packs', name: 'Packs', categoryValue: 'pack' as const },
    { id: 'drinks', name: 'Boissons', categoryValue: 'drink' as const },
    { id: 'salade-jus', name: 'Salades & Jus', categoryValue: 'salade-jus' as const }
  ];

  // Use mapped categories from database or default if none are found
  const categoriesToDisplay = mappedCategories.length > 0 ? mappedCategories : defaultCategories;

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
          
          {/* Open Graph / Facebook */}
          {seo.og_title && <meta property="og:title" content={seo.og_title} />}
          {seo.og_description && <meta property="og:description" content={seo.og_description} />}
          {seo.og_image && <meta property="og:image" content={seo.og_image} />}
          {seo.og_url && <meta property="og:url" content={seo.og_url} />}
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      {/* Promotions Slider - Uses the slider data from database */}
      <PromotionSlider />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Render a separate section for each category */}
      {categoriesToDisplay.map((category) => (
        <PopularItemsSection
          key={category.id}
          title={category.name}
          products={products}
          isLoading={isLoading}
          showAll={true}
          category={category.categoryValue}
        />
      ))}

      {/* Customer Experience Section */}
      <CustomerExperienceSection />
    </div>
  );
};

export default HomePage;
