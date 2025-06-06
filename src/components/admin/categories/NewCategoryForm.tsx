import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { NewCategoryFormData } from '@/types/category';
import CategoryIconPreview from './CategoryIconPreview';

interface NewCategoryFormProps {
  newCategory: NewCategoryFormData;
  onNewCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCategory: () => void;
}

const NewCategoryForm: React.FC<NewCategoryFormProps> = ({
  newCategory,
  onNewCategoryChange,
  onAddCategory
}) => {
  const handleVisibilityChange = (checked: boolean) => {
    const event = {
      target: {
        name: 'isVisible',
        value: checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onNewCategoryChange(event);
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

            <div className="mb-4">
              <label htmlFor="displayOrder" className="block text-sm font-medium mb-1">
                Display Order
              </label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                placeholder="1"
                value={newCategory.displayOrder || ''}
                onChange={onNewCategoryChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first (e.g. 1 appears before 2)
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label htmlFor="visibility" className="text-sm font-medium">
                Show on Homepage
              </label>
              <Switch 
                id="visibility"
                name="isVisible"
                checked={newCategory.isVisible}
                onCheckedChange={handleVisibilityChange}
              />
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
