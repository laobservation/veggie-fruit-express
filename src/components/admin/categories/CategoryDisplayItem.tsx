
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/types/category';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import CategoryIconPreview from './CategoryIconPreview';

interface CategoryDisplayItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
  onUpdateDisplayOrder: (id: string, displayOrder: number) => void;
}

const CategoryDisplayItem: React.FC<CategoryDisplayItemProps> = ({
  category,
  onEdit,
  onDelete,
  onToggleVisibility,
  onUpdateDisplayOrder
}) => {
  const handleMoveUp = () => {
    const currentOrder = category.display_order || 999;
    onUpdateDisplayOrder(category.id, Math.max(1, currentOrder - 1));
  };

  const handleMoveDown = () => {
    const currentOrder = category.display_order || 999;
    onUpdateDisplayOrder(category.id, currentOrder + 1);
  };

  return (
    <div className="border rounded-md p-4 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" onClick={handleMoveUp} className="px-1">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-xs text-center">{category.display_order || 999}</span>
            <Button variant="ghost" size="sm" onClick={handleMoveDown} className="px-1">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <CategoryIconPreview 
            name={category.name} 
            imageIcon={category.image_icon}
            bg={category.background_color}
          />
          
          <div className="flex items-center space-x-4">
            <Switch 
              id={`visibility-toggle-${category.id}`}
              checked={category.is_visible !== false}
              onCheckedChange={(checked) => onToggleVisibility(category.id, checked)}
            />
            <span className={`text-sm ${category.is_visible === false ? 'text-gray-400' : ''}`}>
              {category.is_visible === false ? 'Hidden' : 'Visible'}
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

export default CategoryDisplayItem;
