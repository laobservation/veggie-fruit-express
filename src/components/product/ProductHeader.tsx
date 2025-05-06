
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductHeaderProps {
  product: Product;
  favoriteStatus: boolean;
  handleFavoriteClick: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  product, 
  favoriteStatus, 
  handleFavoriteClick 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center pt-4 pb-2">
      <button 
        onClick={() => navigate(-1)} 
        className="p-2"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-semibold">{product.name}</h1>
      <button 
        onClick={handleFavoriteClick} 
        className="p-2"
        aria-label={favoriteStatus ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart 
          className={`h-6 w-6 transition-colors ${favoriteStatus ? 'fill-red-500 text-red-500' : ''}`}
        />
      </button>
    </div>
  );
};

export default ProductHeader;
