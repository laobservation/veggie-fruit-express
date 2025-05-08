
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/types/product';
import ProductForm from './ProductForm';

interface ProductDialogManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  emptyProduct: Product;
  isEditing: boolean;
  isSaving: boolean;
  onSaveProduct: (product: Product, mediaType: 'image' | 'video') => void;
}

const ProductDialogManager: React.FC<ProductDialogManagerProps> = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  emptyProduct,
  isEditing,
  isSaving,
  onSaveProduct
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <ProductForm 
          product={selectedProduct || emptyProduct}
          isEditing={isEditing}
          onSave={onSaveProduct}
          onCancel={() => onOpenChange(false)}
          isSaving={isSaving}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialogManager;
