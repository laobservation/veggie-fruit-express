import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import { Edit, Trash2, Save, X, Loader2 } from 'lucide-react';

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
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Add New Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              name="name"
              value={newCategory.name}
              onChange={handleNewCategoryChange}
              placeholder="Category Name"
            />
          </div>
          <div>
            <Input
              name="icon"
              value={newCategory.icon}
              onChange={handleNewCategoryChange}
              placeholder="Emoji Icon (e.g. 🍎)"
            />
          </div>
          <div>
            <Input
              name="bg"
              value={newCategory.bg}
              onChange={handleNewCategoryChange}
              placeholder="Background Class (e.g. bg-red-100)"
            />
          </div>
          <div>
            <Button 
              onClick={handleAddCategory}
              className="w-full"
            >
              Add Category
            </Button>
          </div>
        </div>
        <div>
          <Input
            name="imageIcon"
            value={newCategory.imageIcon || ''}
            onChange={handleNewCategoryChange}
            placeholder="Image URL (optional, overrides emoji)"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Categories</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Background</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      {editingId === category.id ? (
                        // Edit mode row
                        <>
                          <TableCell>
                            <Input
                              name="icon"
                              value={editForm?.icon || ''}
                              onChange={handleEditChange}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              name="name"
                              value={editForm?.name || ''}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              name="bg"
                              value={editForm?.bg || ''}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleSaveEdit}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        // View mode row
                        <>
                          <TableCell>
                            {category.imageIcon ? (
                              <img 
                                src={category.imageIcon} 
                                alt={category.name} 
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <span className="text-2xl">{category.icon}</span>
                            )}
                          </TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            <div className={`w-6 h-6 rounded ${category.bg}`}></div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDelete(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No categories found. Add your first category above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
