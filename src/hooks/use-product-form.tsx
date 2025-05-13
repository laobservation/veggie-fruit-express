import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  value: string;
}

export const useProductForm = (product: Product) => {
  // Don't force categoryLink to true, use the actual value
  const initialProduct = {
    ...product
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
        value: cat.name.toLowerCase()
      }));
      
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
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleCheckboxChange = (checked: boolean, field: string) => {
    // Allow categoryLink to be toggled
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
