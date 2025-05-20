
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewCategoryFormData } from '@/types/category';
import CategoryIconPreview from './CategoryIconPreview';

interface NewCategoryFormProps {
  newCategory: NewCategoryFormData;
  onNewCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCategory: () => void;
  onSwitchChange?: (checked: boolean, field: string) => void;
}

const NewCategoryForm: React.FC<NewCategoryFormProps> = ({
  newCategory,
  onNewCategoryChange,
  onAddCategory,
  onSwitchChange
}) => {
  const handleSwitchChange = (checked: boolean, field: string) => {
    if (onSwitchChange) {
      onSwitchChange(checked, field);
    }
  };
  
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl">Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Category Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Category name"
                value={newCategory.name}
                onChange={onNewCategoryChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="imageIcon" className="block text-sm font-medium mb-1">
                Image Icon URL
              </label>
              <Input
                id="imageIcon"
                name="imageIcon"
                placeholder="https://example.com/icon.png"
                value={newCategory.imageIcon || ''}
                onChange={onNewCategoryChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter any direct URL to an image for the category icon
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="bg" className="block text-sm font-medium mb-1">
                Background Color Class
              </label>
              <Input
                id="bg"
                name="bg"
                placeholder="bg-red-100"
                value={newCategory.bg}
                onChange={onNewCategoryChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tailwind CSS background color class (e.g. bg-red-100)
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <label htmlFor="isVisible" className="block text-sm font-medium">
                Visible on Homepage
              </label>
              <Switch
                id="isVisible"
                checked={newCategory.isVisible !== false}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'isVisible')}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="displayOrder" className="block text-sm font-medium mb-1">
                Display Order
              </label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                placeholder="0"
                value={newCategory.displayOrder || 0}
                onChange={onNewCategoryChange}
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower values appear first (0 is first)
              </p>
            </div>

            <Button onClick={onAddCategory} disabled={!newCategory.name}>
              Add Category
            </Button>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="border p-4 rounded-md">
                <CategoryIconPreview 
                  name={newCategory.name} 
                  imageIcon={newCategory.imageIcon}
                  bg={newCategory.bg}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewCategoryForm;
