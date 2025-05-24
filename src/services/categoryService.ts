
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import { Category, NewCategoryFormData } from '@/types/category';
import { toast } from '@/hooks/use-toast';

// Add a new category to the database
export const addCategory = async (newCategory: NewCategoryFormData): Promise<boolean> => {
  try {
    console.log('Adding category:', newCategory);
    const { data, error } = await getCategoriesTable()
      .insert([{
        name: newCategory.name,
        image_icon: newCategory.imageIcon || null,
        background_color: newCategory.bg || 'bg-gray-100',
        is_visible: newCategory.isVisible !== false,
        display_order: newCategory.displayOrder || 999
      }])
      .select();

    if (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: `Failed to add category: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    console.log('Category added successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in addCategory:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while adding the category",
      variant: "destructive"
    });
    return false;
  }
};

// Update an existing category
export const updateCategory = async (category: Category): Promise<boolean> => {
  try {
    console.log('Updating category:', category);
    
    // Build update object with only the fields that should be updated
    const updateData: any = {};
    
    if (category.name) updateData.name = category.name;
    if (category.image_icon !== undefined) updateData.image_icon = category.image_icon;
    if (category.background_color) updateData.background_color = category.background_color;
    if (category.is_visible !== undefined) updateData.is_visible = category.is_visible;
    if (category.display_order !== undefined) updateData.display_order = category.display_order;
    
    // SEO fields
    if (category.meta_title !== undefined) updateData.meta_title = category.meta_title;
    if (category.meta_description !== undefined) updateData.meta_description = category.meta_description;
    if (category.meta_keywords !== undefined) updateData.meta_keywords = category.meta_keywords;
    if (category.canonical_url !== undefined) updateData.canonical_url = category.canonical_url;
    if (category.robots_directives !== undefined) updateData.robots_directives = category.robots_directives;
    if (category.structured_data !== undefined) updateData.structured_data = category.structured_data;
    if (category.og_title !== undefined) updateData.og_title = category.og_title;
    if (category.og_description !== undefined) updateData.og_description = category.og_description;
    if (category.og_image !== undefined) updateData.og_image = category.og_image;
    if (category.og_url !== undefined) updateData.og_url = category.og_url;

    const { data, error } = await getCategoriesTable()
      .update(updateData)
      .eq('id', category.id)
      .select();

    if (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    console.log('Category updated successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while updating the category",
      variant: "destructive"
    });
    return false;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting category with ID:', id);
    const { error } = await getCategoriesTable()
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    console.log('Category deleted successfully');
    toast({
      title: "Success",
      description: "Category deleted successfully"
    });
    return true;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while deleting the category",
      variant: "destructive"
    });
    return false;
  }
};
