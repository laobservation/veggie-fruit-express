
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddCategory();
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleValidateColor = (value: string) => {
    // Simple validation for Tailwind color classes
    if (!value.startsWith('bg-')) {
      return `bg-${value}`;
    }
    return value;
  };
  
  const handleColorBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const validatedColor = handleValidateColor(input.value);
    
    if (validatedColor !== input.value) {
      // Simulate an onChange event with the validated color
      const event = {
        target: {
          name: 'bg',
          value: validatedColor
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onNewCategoryChange(event);
    }
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
              onBlur={handleColorBlur}
              placeholder="Background Class (e.g. bg-red-100)"
            />
            <div className={`w-6 h-6 mt-1 rounded ${newCategory.bg || 'bg-gray-100'}`}></div>
          </div>
          <div className="flex items-end">
            <Button 
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Category'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
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
          {newCategory.imageIcon && (
            <div className="mt-2 p-2 border rounded">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img 
                src={newCategory.imageIcon} 
                alt="Category icon preview" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/32x32?text=Error';
                  toast({
                    title: "Warning",
                    description: "Unable to load image preview",
                    variant: "default" // Changed from "warning" to "default" since "warning" isn't a valid variant
                  });
                }}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewCategoryForm;
