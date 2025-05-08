
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

interface ProductManagerActionsProps {
  onAddProduct: () => void;
}

const ProductManagerActions: React.FC<ProductManagerActionsProps> = ({ onAddProduct }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <Link to="/">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retourner au Site
        </Button>
      </Link>
      <h2 className="text-2xl font-bold">Gestion des Produits</h2>
      <Button onClick={onAddProduct} className="bg-veggie-primary hover:bg-veggie-dark">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un Produit
      </Button>
    </div>
  );
};

export default ProductManagerActions;
