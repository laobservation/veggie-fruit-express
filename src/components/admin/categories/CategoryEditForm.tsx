
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/types/category';
import { Check, X } from 'lucide-react';
import CategoryIconPreview from './CategoryIconPreview';

interface CategoryEditFormProps {
  editForm: Category;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
  editForm,
  onCancelEdit,
  onSaveEdit,
  onEditChange
}) => {
  const handleVisibilityChange = (checked: boolean) => {
    // Create an event-like object and cast it to the expected type
    const event = {
      target: {
        name: 'isVisible',
        value: checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onEditChange(event);
  };

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
            <label htmlFor={`visibility-${editForm.id}`} className="text-sm font-medium">
              Show on Homepage
            </label>
            <Switch 
              id={`visibility-${editForm.id}`}
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
};

export default CategoryEditForm;
