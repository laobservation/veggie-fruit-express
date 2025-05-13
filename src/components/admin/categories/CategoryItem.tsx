
import React from 'react';
import { Edit, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableRow, TableCell } from '@/components/ui/table';
import { Category } from '@/types/category';

interface CategoryItemProps {
  category: Category;
  editingId: string | null;
  editForm: Category | null;
  onEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  editingId,
  editForm,
  onEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDelete
}) => {
  const isEditing = editingId === category.id;
  
  return (
    <TableRow key={category.id}>
      {isEditing && editForm ? (
        // Edit mode row
        <>
          <TableCell>
            <div className="space-y-2">
              <Input
                name="icon"
                value={editForm.icon || ''}
                onChange={onEditChange}
                className="w-full mb-2"
                placeholder="Emoji Icon (e.g. 🍎)"
              />
              <Input
                name="imageIcon"
                value={editForm.imageIcon || ''}
                onChange={onEditChange}
                className="w-full"
                placeholder="Image URL"
              />
              {editForm.imageIcon && (
                <div className="mt-1">
                  <img 
                    src={editForm.imageIcon} 
                    alt="Preview" 
                    className="h-6 w-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/24x24?text=Err';
                    }}
                  />
                </div>
              )}
            </div>
          </TableCell>
          <TableCell>
            <Input
              name="name"
              value={editForm.name || ''}
              onChange={onEditChange}
              required
            />
          </TableCell>
          <TableCell>
            <Input
              name="bg"
              value={editForm.bg || ''}
              onChange={onEditChange}
            />
            <div className={`w-6 h-6 mt-1 rounded ${editForm.bg}`}></div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={onSaveEdit}
                type="button"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onCancelEdit}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </>
      ) : (
        // View mode row
        <>
          <TableCell>
            {category.imageIcon ? (
              <img 
                src={category.imageIcon} 
                alt={category.name} 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-2xl">{category.icon}</span>
            )}
          </TableCell>
          <TableCell>
            {category.name}
            <div className="text-xs text-gray-500 mt-1">
              URL: <code>/category/{category.name.toLowerCase()}</code>
            </div>
          </TableCell>
          <TableCell>
            <div className={`w-6 h-6 rounded ${category.bg}`}></div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(category)}
                type="button"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDelete(category.id)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default CategoryItem;
