
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden">
          <AspectRatio ratio={1/1} className="bg-muted">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
            />
          </AspectRatio>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            <span className="inline-flex items-center rounded-full bg-veggie-light px-2 py-1 text-xs font-medium text-veggie-dark">
              {product.category === 'fruit' ? 'Fruit' : 'Légume'}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">{product.description}</p>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-semibold text-veggie-dark">
              {product.price.toFixed(2)}€
              <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
            </p>
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            size="sm"
            className="bg-veggie-primary hover:bg-veggie-dark text-white rounded-md"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
