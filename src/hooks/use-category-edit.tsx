
import { useState } from 'react';
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
    
    const success = await updateCategory(editForm);
    
    if (success) {
      // Reset form state
      setEditingId(null);
      setEditForm(null);
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
