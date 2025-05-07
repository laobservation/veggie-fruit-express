
import React from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Category } from '../CategoryManager';
import CategoryItem from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  editingId: string | null;
  editForm: Category | null;
  onEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
  editingId,
  editForm,
  onEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Background</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                editingId={editingId}
                editForm={editForm}
                onEdit={onEdit}
                onCancelEdit={onCancelEdit}
                onEditChange={onEditChange}
                onSaveEdit={onSaveEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No categories found. Add your first category above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
