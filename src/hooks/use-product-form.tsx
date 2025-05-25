
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
      
      // FIXED: Map categories correctly to ensure proper assignment
      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        value: cat.name.toLowerCase().replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
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
    if (field === 'category') {
      // FIXED: Find the selected category and use its proper value
      const selectedCategory = categories.find(cat => cat.value === value);
      console.log(`Setting category to: ${value}`, selectedCategory);
      
      // Always set categoryLink to true when a category is selected and use the exact value
      setFormData({
        ...formData,
        category: value as 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus',
        categoryLink: true
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
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
