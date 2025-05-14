
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
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
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    const success = await addCategory(newCategory);
    
    if (success) {
      // Play success sound
      try {
        const audio = new Audio('/success-sound.mp3');
        audio.play();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
      
      // Reset the form
      setNewCategory({
        name: '',
        imageIcon: '',
        bg: 'bg-red-100'
      });
      
      toast({
        title: "Success",
        description: "Category added successfully"
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
