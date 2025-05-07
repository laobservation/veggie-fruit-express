
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
          console.log('CategoryManager: Detected category change, refreshing...');
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
        console.log('Categories fetched:', formattedCategories);
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
    
    try {
      console.log('Updating category:', editForm);
      
      // Map the form fields to database column names
      const updateData = {
        name: editForm.name,
        icon: editForm.icon,
        image_icon: editForm.imageIcon,
        background_color: editForm.bg,
        updated_at: new Date().toISOString()
      };
      
      console.log('Update data being sent to Supabase:', updateData);
      
      // Update the category in the database
      const { error } = await getCategoriesTable()
        .update(updateData)
        .eq('id', editForm.id);
      
      if (error) {
        console.error('Database error when updating category:', error);
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Category updated successfully'
      });
      
      setEditingId(null);
      setEditForm(null);
      
      // Fetch updated categories to ensure UI is in sync
      fetchCategories();
      
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: `Failed to update category: ${error.message || 'Unknown error'}`,
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
      console.log('Adding new category:', newCategory);
      
      // Add the category to the database
      // Ensure field names match the database columns
      const { data, error } = await getCategoriesTable()
        .insert({
          name: newCategory.name,
          icon: newCategory.icon || null,
          image_icon: newCategory.imageIcon || null,
          background_color: newCategory.bg || 'bg-gray-100'
        })
        .select();
      
      if (error) {
        console.error('Database error when adding category:', error);
        throw error;
      }
      
      console.log('New category added:', data);
      
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
      
      // Fetch updated categories to ensure UI is in sync
      fetchCategories();
      
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: `Failed to add category: ${error.message || 'Unknown error'}`,
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
      console.log('Deleting category:', id);
      
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
