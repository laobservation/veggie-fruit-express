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
  return <div className="relative pb-4 px-0 my-0 py-0">
      <div className="flex justify-between items-center mx-[121px] py-0 px-0 my-[9px]">
        <div>
          
          
        </div>
        
        <div className="flex items-center gap-2">
          <SocialShareButtons product={product} />
          
          <button onClick={handleFavoriteClick} aria-label={favoriteStatus ? "Remove from favorites" : "Add to favorites"} className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300", favoriteStatus ? "bg-red-50" : "bg-gray-100")}>
            <Heart className={cn("h-5 w-5 transition-colors duration-300 heart-animation", favoriteStatus ? "fill-red-500 text-red-500 active" : "text-gray-500")} />
          </button>
        </div>
      </div>
    </div>;
};
export default ProductHeader;