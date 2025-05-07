
import React from 'react';
import { Edit, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableRow, TableCell } from '@/components/ui/table';
import { Category } from '../CategoryManager';

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
            <Input
              name="icon"
              value={editForm.icon || ''}
              onChange={onEditChange}
              className="w-24"
            />
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
          <TableCell>{category.name}</TableCell>
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
