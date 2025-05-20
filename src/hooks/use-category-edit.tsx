
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
    const { name, value, type } = e.target;
    if (editForm) {
      console.log(`Changing ${name} to ${value}`);
      setEditForm({
        ...editForm,
        [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
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

  // Toggle visibility of a category without entering edit mode
  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    const updatedCategory = {
      id,
      isVisible
    } as Category;
    
    const success = await updateCategory(updatedCategory);
    
    if (success) {
      toast({
        title: 'Success',
        description: `Category ${isVisible ? 'shown' : 'hidden'} successfully`
      });
    }
  };

  // Update display order of a category
  const handleUpdateDisplayOrder = async (id: string, displayOrder: number) => {
    const updatedCategory = {
      id,
      displayOrder
    } as Category;
    
    const success = await updateCategory(updatedCategory);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Category order updated successfully'
      });
    }
  };
  
  return {
    editingId,
    editForm,
    handleEdit,
    handleCancelEdit,
    handleEditChange,
    handleSaveEdit,
    handleToggleVisibility,
    handleUpdateDisplayOrder
  };
};
