
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Category } from '@/types/category';
import { updateCategory } from '@/services/categoryService';

export const useCategoryEdit = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Category | null>(null);
  
  // Start editing a category
  const handleEdit = (category: Category) => {
    console.log('Starting edit for category:', category);
    setEditingId(category.id);
    setEditForm({...category});
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  // Handle changes to the edit form
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editForm) {
      console.log(`Changing ${name} to ${value}`);
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  // Save edited category
  const handleSaveEdit = async () => {
    if (!editForm) return;
    
    if (!editForm.name) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }
    
    console.log('Saving category with data:', editForm);
    const success = await updateCategory(editForm);
    
    if (success) {
      // Play success sound
      try {
        const audio = new Audio('/success-sound.mp3');
        audio.play();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
      
      // Reset form state
      setEditingId(null);
      setEditForm(null);
      
      toast({
        title: 'Success',
        description: 'Category updated successfully'
      });
    }
  };
  
  return {
    editingId,
    editForm,
    handleEdit,
    handleCancelEdit,
    handleEditChange,
    handleSaveEdit
  };
};
