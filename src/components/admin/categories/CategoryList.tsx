
import React from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Category } from '@/types/category';
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
  onToggleVisibility: (id: string, isVisible: boolean) => void;
  onUpdateDisplayOrder: (id: string, displayOrder: number) => void;
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
  onDelete,
  onToggleVisibility,
  onUpdateDisplayOrder
}) => {
  // Sort categories by display_order
  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = a.display_order || 999;
    const orderB = b.display_order || 999;
    return orderA - orderB;
  });

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
            <TableHead>Order</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Background</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCategories.length > 0 ? (
            sortedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell colSpan={6} className="p-0">
                  <CategoryItem
                    category={category}
                    editingId={editingId}
                    editForm={editForm}
                    onEdit={onEdit}
                    onCancelEdit={onCancelEdit}
                    onEditChange={onEditChange}
                    onSaveEdit={onSaveEdit}
                    onDelete={onDelete}
                    onToggleVisibility={onToggleVisibility}
                    onUpdateDisplayOrder={onUpdateDisplayOrder}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
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
