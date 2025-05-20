
import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/use-categories';
import { getProductsWithStock } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { fixProductImportType } from '@/services/productService';
import { Product } from '@/types/product';
import PromotionSlider from '@/components/home/PromotionSlider';
import CategoriesSection from '@/components/home/CategoriesSection';
import PopularItemsSection from '@/components/home/PopularItemsSection';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();

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

  // Filter categories that should be visible
  const visibleCategories = categories
    .filter(cat => cat.isVisible !== false)
    .sort((a, b) => {
      const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
      const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
      return orderA - orderB;
    });

  // Map categories from database format to our application format
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
    </div>
  );
};

export default HomePage;
