
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NewCategoryFormData } from '@/types/category';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';

export const useNewCategory = () => {
  const [newCategory, setNewCategory] = useState<NewCategoryFormData>({
    name: '',
    imageIcon: '',
    bg: 'bg-gray-100',
    isVisible: true,
    displayOrder: 0
  });

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewCategory({
        ...newCategory,
        [name]: parseInt(value)
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
  };
  
  const handleNewCategorySwitchChange = (checked: boolean, field: string) => {
    setNewCategory({
      ...newCategory,
      [field]: checked
    });
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await getCategoriesTable().insert({
        name: newCategory.name,
        image_icon: newCategory.imageIcon || null,
        background_color: newCategory.bg || 'bg-gray-100',
        is_visible: newCategory.isVisible,
        display_order: newCategory.displayOrder || 0
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      // Reset form
      setNewCategory({
        name: '',
        imageIcon: '',
        bg: 'bg-gray-100',
        isVisible: true,
        displayOrder: 0
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  };

  return {
    newCategory,
    handleNewCategoryChange,
    handleNewCategorySwitchChange,
    handleAddCategory
  };
};
