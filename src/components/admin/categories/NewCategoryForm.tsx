
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewCategoryFormProps {
  newCategory: {
    name: string;
    icon?: string;
    imageIcon?: string;
    bg: string;
  };
  onNewCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCategory: () => void;
}

const NewCategoryForm: React.FC<NewCategoryFormProps> = ({
  newCategory,
  onNewCategoryChange,
  onAddCategory
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name*
            </label>
            <Input
              id="name"
              name="name"
              value={newCategory.name}
              onChange={onNewCategoryChange}
              placeholder="Category Name"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
              Emoji Icon
            </label>
            <Input
              id="icon"
              name="icon"
              value={newCategory.icon || ''}
              onChange={onNewCategoryChange}
              placeholder="Emoji Icon (e.g. 🍎)"
            />
          </div>
          <div>
            <label htmlFor="bg" className="block text-sm font-medium text-gray-700 mb-1">
              Background Class
            </label>
            <Input
              id="bg"
              name="bg"
              value={newCategory.bg}
              onChange={onNewCategoryChange}
              placeholder="Background Class (e.g. bg-red-100)"
            />
          </div>
          <div className="flex items-end">
            <Button 
              type="submit"
              className="w-full"
            >
              Add Category
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="imageIcon" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <Input
            id="imageIcon"
            name="imageIcon"
            value={newCategory.imageIcon || ''}
            onChange={onNewCategoryChange}
            placeholder="Image URL (optional, overrides emoji)"
          />
        </div>
      </form>
    </div>
  );
};

export default NewCategoryForm;
