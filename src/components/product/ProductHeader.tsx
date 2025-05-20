import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import SocialShareButtons from './SocialShareButtons';
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
  return <div className="relative pb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-gray-800 mx-0 py-0 px-0 text-xl my-[41px]">{product.name}</h1>
          
        </div>
        
        <div className="flex items-center gap-2">
          <SocialShareButtons product={product} />
          
          <button onClick={handleFavoriteClick} aria-label={favoriteStatus ? "Remove from favorites" : "Add to favorites"} className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300", favoriteStatus ? "bg-red-50" : "bg-gray-100")}>
            <Heart className={cn("h-5 w-5 transition-colors duration-300", favoriteStatus ? "fill-red-500 text-red-500" : "text-gray-500")} />
          </button>
        </div>
      </div>
    </div>;
};
export default ProductHeader;