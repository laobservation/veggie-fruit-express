
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
        // Convert name to lowercase and handle special cases
        value: getCategoryValue(cat.name.toLowerCase())
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };
  
  // Helper to map UI category names to database category values
  const getCategoryValue = (name: string): string => {
    // Map special cases
    const mapping: Record<string, string> = {
      'fruits': 'fruit',
      'légumes': 'vegetable',
      'salades & jus': 'salade-jus',
      'salade & jus': 'salade-jus'
    };
    
    return mapping[name.toLowerCase()] || name.toLowerCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['price', 'stock'].includes(name) ? parseFloat(value) : value
    });
  };
  
  const handleSelectChange = (value: string, field: string) => {
    // If changing category, also set categoryLink to true
    if (field === 'category') {
      // Map the category value to a valid type
      const categoryValue = validateCategoryValue(value);
      
      // Always set categoryLink to true when a category is selected
      setFormData({
        ...formData,
        [field]: categoryValue,
        categoryLink: true
      });
      console.log(`Category set to ${categoryValue} with categoryLink=true`);
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };
  
  // Helper to validate and ensure proper category values
  const validateCategoryValue = (value: string): 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus' => {
    // Define valid categories
    const validCategories: ('fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus')[] = [
      'fruit', 'vegetable', 'pack', 'drink', 'salade-jus'
    ];
    
    // Check if value is already a valid category
    if (validCategories.includes(value as any)) {
      return value as 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus';
    }
    
    // Map common variations
    const categoryMap: Record<string, 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus'> = {
      'fruits': 'fruit',
      'légumes': 'vegetable',
      'légume': 'vegetable',
      'vegetables': 'vegetable',
      'packs': 'pack',
      'drinks': 'drink',
      'boissons': 'drink',
      'salade-jus': 'salade-jus',
      'salades & jus': 'salade-jus',
      'salade & jus': 'salade-jus'
    };
    
    return categoryMap[value.toLowerCase()] || 'vegetable'; // Default to vegetable
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
