
import React, { useEffect, useRef, useState } from 'react';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface RelatedProductsProps {
  products: Product[];
  categoryText: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  categoryText
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(products.length / 3); // Changed from 4 to 3

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
    if (products.length > 3 && !isPaused) { // Changed from 4 to 3
      autoplayRef.current = setInterval(() => {
        if (carouselRef.current) {
          const nextButton = carouselRef.current.querySelector('[aria-label="Next slide"]');
          if (nextButton && nextButton instanceof HTMLButtonElement) {
            nextButton.click();
            setCurrentSlide(prev => (prev + 1) % totalSlides);
          }
        }
      }, 6000); // Increased from 5000 to 6000 for smoother transition
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

  const handleManualSlide = (direction: 'prev' | 'next') => {
    if (carouselRef.current) {
      const button = carouselRef.current.querySelector(`[aria-label="${direction === 'prev' ? 'Previous slide' : 'Next slide'}"]`);
      if (button && button instanceof HTMLButtonElement) {
        button.click();
        setCurrentSlide(prev => {
          if (direction === 'prev') {
            return prev === 0 ? totalSlides - 1 : prev - 1;
          } else {
            return (prev + 1) % totalSlides;
          }
        });
      }
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg px-0 mx-0 my-0 py-[6px]">Autres {categoryText}</h2>
        
        <div className="flex items-center gap-2">
          <div className="mr-3 flex gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-1.5 rounded-full ${i === currentSlide ? 'bg-green-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => handleManualSlide('prev')} 
            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
            aria-label="Previous products"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => handleManualSlide('next')} 
            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
            aria-label="Next products"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef} 
        onMouseEnter={handlePause} 
        onMouseLeave={handleResume} 
        onTouchStart={handlePause} 
        onTouchEnd={handleResume}
        className="relative"
      >
        <Carousel opts={{
          align: "start",
          loop: true,
          slidesToScroll: 3, // Changed from 4 to 3
        }}>
          <CarouselContent>
            {products.map(relatedProduct => (
              <CarouselItem key={relatedProduct.id} className="basis-1/3"> {/* Changed from basis-1/4 to basis-1/3 */}
                <div className="cursor-pointer relative p-1" onClick={() => handleProductClick(relatedProduct.id)}>
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  {/* Product name */}
                  <div className="mt-2 text-sm font-medium text-center truncate">
                    {relatedProduct.name}
                  </div>
                  {/* Add quick-add button */}
                  <button 
                    className="absolute bottom-2 right-2 p-1 bg-green-500 rounded-full shadow-md hover:bg-green-600 transition-colors" 
                    onClick={e => handleAddToCart(e, relatedProduct)} 
                    aria-label="Ajouter au panier"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
        
        {/* Swipe hint animation - moved to white space */}
        {products.length > 3 && !isPaused && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 animate-pulse bg-white/80 p-1 rounded-full">
            <div className="flex items-center gap-1">
              <ChevronRight size={16} className="text-gray-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
