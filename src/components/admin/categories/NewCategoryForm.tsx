
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
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Add New Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            name="name"
            value={newCategory.name}
            onChange={onNewCategoryChange}
            placeholder="Category Name"
          />
        </div>
        <div>
          <Input
            name="icon"
            value={newCategory.icon || ''}
            onChange={onNewCategoryChange}
            placeholder="Emoji Icon (e.g. 🍎)"
          />
        </div>
        <div>
          <Input
            name="bg"
            value={newCategory.bg}
            onChange={onNewCategoryChange}
            placeholder="Background Class (e.g. bg-red-100)"
          />
        </div>
        <div>
          <Button 
            onClick={onAddCategory}
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
          onChange={onNewCategoryChange}
          placeholder="Image URL (optional, overrides emoji)"
        />
      </div>
    </div>
  );
};

export default NewCategoryForm;
