
import React, { useEffect, useRef, useState } from 'react';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { Plus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface RelatedProductsProps {
  products: Product[];
  categoryText: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, categoryText }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Start autoplay for carousel
    startAutoplay();
    
    // Cleanup on unmount
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [products]);

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    // Only start autoplay if we have enough products and it's not paused
    if (products.length > 4 && !isPaused) {
      autoplayRef.current = setInterval(() => {
        if (carouselRef.current) {
          const nextButton = carouselRef.current.querySelector('[aria-label="Next slide"]');
          if (nextButton && nextButton instanceof HTMLButtonElement) {
            nextButton.click();
          }
        }
      }, 5000); // Slide every 5 seconds
    }
  };
  
  const handlePause = () => {
    setIsPaused(true);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };
  
  const handleResume = () => {
    setIsPaused(false);
    startAutoplay();
  };
  
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Autres {categoryText}</h2>
      
      <div 
        ref={carouselRef}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {products.map((relatedProduct) => (
              <CarouselItem key={relatedProduct.id} className="sm:basis-1/2 md:basis-1/4 lg:basis-1/4">
                <div 
                  className="cursor-pointer relative p-1"
                  onClick={() => handleProductClick(relatedProduct.id)}
                >
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {/* Product name */}
                  <div className="mt-2 text-sm font-medium text-center">
                    {relatedProduct.name}
                  </div>
                  {/* Add quick-add button */}
                  <button 
                    className="absolute bottom-2 right-2 p-1 bg-green-500 rounded-full shadow-md hover:bg-green-600 transition-colors"
                    onClick={(e) => handleAddToCart(e, relatedProduct)}
                    aria-label="Ajouter au panier"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default RelatedProducts;
