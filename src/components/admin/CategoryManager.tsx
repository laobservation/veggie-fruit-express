
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import NewCategoryForm from './categories/NewCategoryForm';
import CategoryList from './categories/CategoryList';
import { toast } from 'sonner';

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
  const { toast: uiToast } = useToast();

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
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      uiToast({
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
      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', editForm.id);
      
      if (error) {
        console.error('Database error when updating category:', error);
        throw error;
      }
      
      // Update local state to reflect changes immediately
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === editForm.id ? {
            ...cat,
            name: editForm.name,
            icon: editForm.icon,
            imageIcon: editForm.imageIcon,
            bg: editForm.bg,
            path: `/category/${editForm.name.toLowerCase()}`
          } : cat
        )
      );

      // Also update any products that reference this category
      // This ensures product filtering still works correctly
      const oldName = categories.find(c => c.id === editForm.id)?.name;
      if (oldName && oldName !== editForm.name) {
        // Find all products with the old category name and update them
        const { data: productsToUpdate } = await supabase
          .from('Products')
          .select('id')
          .eq('category', oldName);

        if (productsToUpdate && productsToUpdate.length > 0) {
          const productIds = productsToUpdate.map(p => p.id);
          
          // Update all products with the new category name
          await supabase
            .from('Products')
            .update({ category: editForm.name })
            .in('id', productIds);
            
          console.log(`Updated ${productIds.length} products to new category: ${editForm.name}`);
          toast.success(`Catégorie et ${productIds.length} produits mis à jour`);
        } else {
          toast.success("Catégorie mise à jour");
        }
      } else {
        toast.success("Catégorie mise à jour");
      }
      
      uiToast({
        title: 'Success',
        description: 'Category updated successfully'
      });
      
      setEditingId(null);
      setEditForm(null);
      
    } catch (error: any) {
      console.error('Error updating category:', error);
      uiToast({
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
      uiToast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      console.log('Adding new category:', newCategory);
      
      // Prepare data for insertion
      const insertData = {
        name: newCategory.name,
        icon: newCategory.icon || null,
        image_icon: newCategory.imageIcon || null,
        background_color: newCategory.bg || 'bg-gray-100'
      };
      
      // Check if a category with this name already exists
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', newCategory.name);
        
      if (existingCategories && existingCategories.length > 0) {
        toast.error(`Une catégorie avec le nom "${newCategory.name}" existe déjà`);
        return;
      }
      
      // Use direct Supabase client instead of helper function to bypass RLS
      const { data, error } = await supabase
        .from('categories')
        .insert(insertData)
        .select();
      
      if (error) {
        console.error('Database error when adding category:', error);
        throw error;
      }
      
      console.log('New category added:', data);
      
      // Add the new category to local state immediately
      if (data && data.length > 0) {
        const newCat = data[0];
        const formattedCategory: Category = {
          id: newCat.id,
          name: newCat.name,
          icon: newCat.icon || undefined,
          imageIcon: newCat.image_icon,
          bg: newCat.background_color || 'bg-gray-100',
          path: `/category/${newCat.name.toLowerCase()}`
        };
        
        setCategories([...categories, formattedCategory]);
      }
      
      // Reset the form
      setNewCategory({
        name: '',
        icon: '🍎',
        bg: 'bg-red-100'
      });
      
      toast.success("Nouvelle catégorie ajoutée");
      uiToast({
        title: 'Success',
        description: 'Category added successfully'
      });
      
    } catch (error: any) {
      console.error('Error adding category:', error);
      uiToast({
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
      // Find the category to be deleted for potential product updates
      const categoryToDelete = categories.find(cat => cat.id === id);
      if (!categoryToDelete) {
        throw new Error('Category not found');
      }
      
      console.log('Deleting category:', id);
      
      // Update products in this category to a default category or null
      const { data: productsToUpdate } = await supabase
        .from('Products')
        .select('id')
        .eq('category', categoryToDelete.name);
        
      if (productsToUpdate && productsToUpdate.length > 0) {
        const productIds = productsToUpdate.map(p => p.id);
        
        // Update products to have no category
        await supabase
          .from('Products')
          .update({ category: null })
          .in('id', productIds);
          
        console.log(`Updated ${productIds.length} products to remove the deleted category`);
      }
      
      // Delete the category from the database
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state immediately
      setCategories(categories.filter(cat => cat.id !== id));
      
      toast.success(`Catégorie "${categoryToDelete.name}" supprimée`);
      uiToast({
        title: 'Success',
        description: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      uiToast({
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
