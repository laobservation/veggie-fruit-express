
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/category';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import CategoryIconPreview from './CategoryIconPreview';

interface CategoryItemProps {
  category: Category;
  editingId: string | null;
  editForm: Category | null;
  onEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  editingId,
  editForm,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditChange
}) => {
  const isEditing = editingId === category.id;
  
  if (isEditing && editForm) {
    return (
      <div className="border rounded-md p-4 mb-2 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                name="name"
                value={editForm.name}
                onChange={onEditChange}
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Emoji Icon</label>
              <Input
                type="text"
                name="icon"
                value={editForm.icon || ''}
                onChange={onEditChange}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty if using image icon</p>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Image Icon URL</label>
              <Input
                type="text"
                name="imageIcon"
                value={editForm.imageIcon || ''}
                onChange={onEditChange}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use emoji icon</p>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <Input
                type="text"
                name="bg"
                value={editForm.bg}
                onChange={onEditChange}
              />
              <p className="text-xs text-gray-500 mt-1">Enter Tailwind CSS color class (e.g. bg-red-100)</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="border p-4 rounded-md">
                <CategoryIconPreview 
                  name={editForm.name} 
                  icon={editForm.icon} 
                  imageIcon={editForm.imageIcon}
                  bg={editForm.bg}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onCancelEdit}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={onSaveEdit}>
            <Check className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 mb-2 flex justify-between items-center">
      <div className="flex items-center">
        <CategoryIconPreview 
          name={category.name} 
          icon={category.icon} 
          imageIcon={category.imageIcon}
          bg={category.bg}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default CategoryItem;
