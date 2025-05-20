
import React from 'react';
import { useCategories } from '@/hooks/use-categories';
import { useCategoryEdit } from '@/hooks/use-category-edit';
import { useNewCategory } from '@/hooks/use-new-category';
import { deleteCategory } from '@/services/categoryService';
import NewCategoryForm from './categories/NewCategoryForm';
import CategoryList from './categories/CategoryList';

const CategoryManager: React.FC = () => {
  const { categories, loading, fetchCategories } = useCategories();
  const { editingId, editForm, handleEdit, handleCancelEdit, handleEditChange, handleSaveEdit, handleToggleVisibility, handleUpdateDisplayOrder } = useCategoryEdit();
  const { newCategory, handleNewCategoryChange, handleAddCategory } = useNewCategory();

  // Handle category deletion and update the UI
  const handleDelete = async (id: string) => {
    const success = await deleteCategory(id);
    if (success) {
      fetchCategories();
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
          onToggleVisibility={handleToggleVisibility}
          onUpdateDisplayOrder={handleUpdateDisplayOrder}
        />
      </div>
    </div>
  );
};

export default CategoryManager;
