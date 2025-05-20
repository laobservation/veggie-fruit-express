
import React from 'react';
import { Category } from '@/types/category';
import CategoryEditForm from './CategoryEditForm';
import CategoryDisplayItem from './CategoryDisplayItem';

interface CategoryItemProps {
  category: Category;
  editingId: string | null;
  editForm: Category | null;
  onEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
  onUpdateDisplayOrder: (id: string, displayOrder: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  editingId,
  editForm,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditChange,
  onToggleVisibility,
  onUpdateDisplayOrder
}) => {
  const isEditing = editingId === category.id;
  
  if (isEditing && editForm) {
    return (
      <CategoryEditForm 
        editForm={editForm}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
        onEditChange={onEditChange}
      />
    );
  }

  return (
    <CategoryDisplayItem
      category={category}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      onUpdateDisplayOrder={onUpdateDisplayOrder}
    />
  );
};

export default CategoryItem;
