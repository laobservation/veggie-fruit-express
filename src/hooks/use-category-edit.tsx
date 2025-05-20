
import { useState } from 'react';
import { Category } from '@/types/category';
import { toast } from '@/hooks/use-toast';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';

export const useCategoryEdit = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({...category});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;
    
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setEditForm({
        ...editForm,
        [name]: parseInt(value)
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };
  
  const handleSwitchChange = (checked: boolean, field: string) => {
    if (!editForm) return;
    
    setEditForm({
      ...editForm,
      [field]: checked
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    
    try {
      const { error } = await getCategoriesTable()
        .update({
          name: editForm.name,
          image_icon: editForm.imageIcon,
          background_color: editForm.bg,
          is_visible: editForm.isVisible,
          display_order: editForm.displayOrder || 0
        })
        .eq('id', editingId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };

  return {
    editingId,
    editForm,
    handleEdit,
    handleCancelEdit,
    handleEditChange,
    handleSwitchChange,
    handleSaveEdit
  };
};
