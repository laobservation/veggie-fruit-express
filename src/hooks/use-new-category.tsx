
import { useState } from 'react';
import { NewCategoryFormData } from '@/types/category';
import { addCategory } from '@/services/categoryService';

export const useNewCategory = () => {
  const [newCategory, setNewCategory] = useState<NewCategoryFormData>({
    name: '',
    imageIcon: '',
    bg: 'bg-red-100'
  });
  
  // Handle changes to the new category form
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // Add a new category
  const handleAddCategory = async () => {
    const success = await addCategory(newCategory);
    
    if (success) {
      // Reset the form
      setNewCategory({
        name: '',
        imageIcon: '',
        bg: 'bg-red-100'
      });
    }
  };
  
  return {
    newCategory,
    setNewCategory,
    handleNewCategoryChange,
    handleAddCategory
  };
};
