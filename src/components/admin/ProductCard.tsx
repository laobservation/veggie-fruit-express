
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Youtube } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  // Function to display category name with proper formatting
  const getCategoryDisplay = (category: 'fruit' | 'vegetable' | 'pack' | 'drink') => {
    switch(category) {
      case 'fruit': return 'Fruit';
      case 'vegetable': return 'Légume';
      case 'pack': return 'Pack';
      case 'drink': return 'Boisson';
      default: return category;
    }
  };

  return (
    <div className="border rounded-md p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(product)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="aspect-square overflow-hidden rounded mb-2 bg-gray-100">
        {product.videoUrl ? (
          // Show a video thumbnail with play button overlay
          <div className="relative w-full h-full">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-3">
                <Youtube className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <p className="text-gray-700 mb-2 text-sm line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between mt-auto">
        <span className="text-green-600 font-bold">{formatPrice(product.price)}</span>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
          {getCategoryDisplay(product.category)}
        </span>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className={`text-sm ${product.stock && product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
          Stock: {product.stock || 0}
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(product.id)}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
