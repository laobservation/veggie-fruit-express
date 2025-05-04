
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  isLoading, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-veggie-primary"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun produit trouvé. Commencez par ajouter un nouveau produit.</p>
        <Button 
          onClick={onAddProduct}
          className="mt-4 bg-veggie-primary hover:bg-veggie-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Produit
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;
