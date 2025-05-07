
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import NewCategoryForm from './categories/NewCategoryForm';
import CategoryList from './categories/CategoryList';

// Define the Category interface
export interface Category {
  id: string;
  name: string;
  icon?: string;
  imageIcon?: string;
  bg: string;
  path?: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    icon: '🍎',
    bg: 'bg-red-100'
  });
  const { toast } = useToast();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    
    // Set up a realtime subscription for category changes
    const channel = supabase
      .channel('category-changes')
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

  // Fetch categories from the database
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await getCategoriesTable()
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Transform data to match our Category interface
      if (data && data.length > 0) {
        const formattedCategories: Category[] = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || undefined,
          imageIcon: cat.image_icon,
          bg: cat.background_color || 'bg-gray-100',
          path: `/category/${cat.name.toLowerCase()}`
        }));
        
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Start editing a category
  const handleEdit = (category: Category) => {
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
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  // Save edited category
  const handleSaveEdit = async () => {
    if (!editForm) return;
    
    try {
      // Update the category in the database
      const { error } = await getCategoriesTable()
        .update({
          name: editForm.name,
          icon: editForm.icon,
          image_icon: editForm.imageIcon,
          background_color: editForm.bg
        })
        .eq('id', editForm.id);
      
      if (error) throw error;
      
      // Update local state
      setCategories(categories.map(cat => 
        cat.id === editForm.id ? {
          ...editForm,
          path: `/category/${editForm.name.toLowerCase()}`
        } : cat
      ));
      
      toast({
        title: 'Success',
        description: 'Category updated successfully'
      });
      
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive'
      });
    }
  };

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
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Add the category to the database
      const { data, error } = await getCategoriesTable()
        .insert({
          name: newCategory.name,
          icon: newCategory.icon,
          image_icon: newCategory.imageIcon,
          background_color: newCategory.bg
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const newCat: Category = {
        id: data.id,
        name: data.name,
        icon: data.icon || undefined,
        imageIcon: data.image_icon,
        bg: data.background_color || 'bg-gray-100',
        path: `/category/${data.name.toLowerCase()}`
      };
      
      setCategories([...categories, newCat]);
      
      // Reset the form
      setNewCategory({
        name: '',
        icon: '🍎',
        bg: 'bg-red-100'
      });
      
      toast({
        title: 'Success',
        description: 'Category added successfully'
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive'
      });
    }
  };

  // Delete a category
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      // Delete the category from the database
      const { error } = await getCategoriesTable()
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setCategories(categories.filter(cat => cat.id !== id));
      
      toast({
        title: 'Success',
        description: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <NewCategoryForm 
        newCategory={newCategory} 
        onNewCategoryChange={handleNewCategoryChange} 
        onAddCategory={handleAddCategory} 
      />

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Categories</h2>
        <CategoryList 
          categories={categories}
          loading={loading}
          editingId={editingId}
          editForm={editForm}
          onEdit={handleEdit}
          onCancelEdit={handleCancelEdit}
          onEditChange={handleEditChange}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CategoryManager;
