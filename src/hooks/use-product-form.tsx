
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  value: string;
}

export const useProductForm = (product: Product) => {
  // Make sure we have the correct initial value for categoryLink
  const initialProduct = {
    ...product,
    categoryLink: product.categoryLink !== undefined ? product.categoryLink : true // Default to true
  };
  
  const [formData, setFormData] = useState<Product>(initialProduct);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(product.videoUrl ? 'video' : 'image');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [additionalImageUrl, setAdditionalImageUrl] = useState("");

  // Fetch categories on hook mount
  useEffect(() => {
    fetchCategories();

    // Subscribe to category changes
    const channel = supabase
      .channel('dynamic-categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initialize additionalImages if not present
  useEffect(() => {
    if (!formData.additionalImages) {
      setFormData({
        ...formData,
        additionalImages: []
      });
    }
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        // FIXED: Use the database name directly as value - this ensures all categories work
        value: cat.name.toLowerCase()
      }));
      
      console.log('Formatted categories for product form:', formattedCategories);
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['price', 'stock'].includes(name) ? parseFloat(value) : value
    });
  };
  
  const handleSelectChange = (value: string, field: string) => {
    // FIXED: If changing category, map the selected category name properly
    if (field === 'category') {
      // Find the selected category to get the proper mapping
      const selectedCategory = categories.find(cat => cat.value === value);
      let categoryValue: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus' = 'vegetable'; // Default value
      
      // Map to valid database category values
      if (selectedCategory) {
        const categoryName = selectedCategory.name.toLowerCase();
        categoryValue = mapCategoryNameToValue(categoryName);
      } else {
        // Fallback mapping if category not found
        categoryValue = mapCategoryNameToValue(value);
      }
      
      console.log(`Setting category from ${value} to ${categoryValue} with categoryLink=true`);
      
      // Always set categoryLink to true when a category is selected
      setFormData({
        ...formData,
        [field]: categoryValue,
        categoryLink: true
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };
  
  // FIXED: Enhanced mapping function that handles all category names and returns proper type
  const mapCategoryNameToValue = (name: string): 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus' => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('fruit') || lowerName === 'fruits') {
      return 'fruit';
    } else if (lowerName.includes('légume') || lowerName.includes('vegetable') || lowerName === 'légumes') {
      return 'vegetable';
    } else if (lowerName.includes('pack') || lowerName === 'packs') {
      return 'pack';
    } else if (lowerName.includes('boisson') || lowerName.includes('drink') || lowerName === 'boissons' || lowerName === 'drinks') {
      return 'drink';
    } else if (lowerName.includes('salade') || lowerName.includes('jus')) {
      return 'salade-jus';
    } else {
      // Default fallback
      return 'vegetable';
    }
  };
  
  const handleCheckboxChange = (checked: boolean, field: string) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  const handleAddAdditionalImage = () => {
    if (additionalImageUrl && additionalImageUrl.trim()) {
      setFormData({
        ...formData,
        additionalImages: [...(formData.additionalImages || []), additionalImageUrl.trim()]
      });
      setAdditionalImageUrl("");
    }
  };

  const handleRemoveAdditionalImage = (indexToRemove: number) => {
    setFormData({
      ...formData,
      additionalImages: (formData.additionalImages || []).filter((_, index) => index !== indexToRemove)
    });
  };

  return {
    formData,
    mediaType,
    setMediaType,
    categories,
    loadingCategories,
    additionalImageUrl,
    setAdditionalImageUrl,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddAdditionalImage,
    handleRemoveAdditionalImage
  };
};
