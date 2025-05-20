
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/types/category';
import { Pencil, Trash2, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
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
  
  const handleVisibilityChange = (checked: boolean) => {
    if (editForm && isEditing) {
      // Create an event-like object and cast it to the expected type
      const event = {
        target: {
          name: 'isVisible',
          value: checked
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onEditChange(event);
    } else {
      onToggleVisibility(category.id, checked);
    }
  };

  const handleMoveUp = () => {
    const currentOrder = category.displayOrder || 999;
    onUpdateDisplayOrder(category.id, Math.max(1, currentOrder - 1));
  };

  const handleMoveDown = () => {
    const currentOrder = category.displayOrder || 999;
    onUpdateDisplayOrder(category.id, currentOrder + 1);
  };
  
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
              <label className="block text-sm font-medium mb-1">Image Icon URL</label>
              <Input
                type="text"
                name="imageIcon"
                value={editForm.imageIcon || ''}
                onChange={onEditChange}
                placeholder="https://example.com/image.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter any image URL for category icon (direct link to image)
              </p>
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

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <Input
                type="number"
                name="displayOrder"
                value={editForm.displayOrder || ''}
                onChange={onEditChange}
                placeholder="1"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <label htmlFor={`visibility-${category.id}`} className="text-sm font-medium">
                Show on Homepage
              </label>
              <Switch 
                id={`visibility-${category.id}`}
                checked={editForm.isVisible || false}
                onCheckedChange={handleVisibilityChange}
              />
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="border p-4 rounded-md">
                <CategoryIconPreview 
                  name={editForm.name} 
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
    <div className="border rounded-md p-4 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" onClick={handleMoveUp} className="px-1">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-xs text-center">{category.displayOrder || 999}</span>
            <Button variant="ghost" size="sm" onClick={handleMoveDown} className="px-1">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <CategoryIconPreview 
            name={category.name} 
            imageIcon={category.imageIcon}
            bg={category.bg}
          />
          
          <div className="flex items-center space-x-4">
            <Switch 
              id={`visibility-toggle-${category.id}`}
              checked={category.isVisible !== false}
              onCheckedChange={(checked) => onToggleVisibility(category.id, checked)}
            />
            <span className={`text-sm ${category.isVisible === false ? 'text-gray-400' : ''}`}>
              {category.isVisible === false ? 'Hidden' : 'Visible'}
            </span>
          </div>
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
    </div>
  );
};

export default CategoryItem;
