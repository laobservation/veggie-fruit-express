
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Category, NewCategoryFormData } from '@/types/category';

// Add a new category
export const addCategory = async (newCategory: NewCategoryFormData): Promise<boolean> => {
  if (!newCategory.name) {
    toast({
      title: 'Error',
      description: 'Category name is required',
      variant: 'destructive'
    });
    return false;
  }
  
  try {
    console.log('Adding new category:', newCategory);
    
    // Prepare data for insertion
    const insertData = {
      name: newCategory.name,
      image_icon: newCategory.imageIcon || null,
      background_color: newCategory.bg || 'bg-gray-100'
    };
    
    console.log('Insert data being sent to Supabase:', insertData);
    
    // Insert the new category
    const { data, error } = await supabase
      .from('categories')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Database error when adding category:', error);
      throw error;
    }
    
    console.log('New category added:', data);
    
    toast({
      title: 'Success',
      description: 'Category added successfully'
    });
    
    return true;
    
  } catch (error: any) {
    console.error('Error adding category:', error);
    toast({
      title: 'Error',
      description: `Failed to add category: ${error.message || 'Unknown error'}`,
      variant: 'destructive'
    });
    return false;
  }
};

// Update an existing category
export const updateCategory = async (category: Category): Promise<boolean> => {
  try {
    console.log('Updating category:', category);
    
    // Map the form fields to database column names
    const { id, name, imageIcon, bg } = category;
    
    const updateData = {
      name,
      image_icon: imageIcon, // Don't convert to null if empty string, allow direct URL inputs
      background_color: bg,
      updated_at: new Date().toISOString()
    };
    
    console.log('Update data being sent to Supabase:', updateData);
    
    // Update the category in the database
    const { error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Database error when updating category:', error);
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Category updated successfully'
    });
    
    return true;
    
  } catch (error: any) {
    console.error('Error updating category:', error);
    toast({
      title: 'Error',
      description: `Failed to update category: ${error.message || 'Unknown error'}`,
      variant: 'destructive'
    });
    return false;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  if (!window.confirm('Are you sure you want to delete this category?')) {
    return false;
  }
  
  try {
    console.log('Deleting category:', id);
    
    // Delete the category from the database
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Category deleted successfully'
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete category',
      variant: 'destructive'
    });
    return false;
  }
};
