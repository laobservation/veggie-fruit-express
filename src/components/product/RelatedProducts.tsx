
import React, { useRef, useState } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

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

  const canSlidePrev = totalSlides > 1;
  const canSlideNext = totalSlides > 1;

  return (
    <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg px-0 mx-0 my-0 py-[6px]">Autres {categoryText}</h2>
        
        <div className="flex items-center gap-3">
          {/* Slide indicators */}
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  // Manual navigation to specific slide would require more complex carousel control
                }}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  i === currentSlide ? 'bg-green-500 w-4' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleManualSlide('prev')} 
              disabled={!canSlidePrev}
              className={`p-1.5 rounded-full border-2 transition-all duration-200 ${
                canSlidePrev
                  ? 'border-green-500 text-green-600 hover:bg-green-50 hover:scale-110 shadow-sm hover:shadow-md'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous products"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => handleManualSlide('next')} 
              disabled={!canSlideNext}
              className={`p-1.5 rounded-full border-2 transition-all duration-200 ${
                canSlideNext
                  ? 'border-green-500 text-green-600 hover:bg-green-50 hover:scale-110 shadow-sm hover:shadow-md'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Next products"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={carouselRef} 
        className="relative"
      >
        <Carousel 
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: itemsPerSlide,
          }}
        >
          <CarouselContent>
            {products.map((relatedProduct) => (
              <CarouselItem key={relatedProduct.id} className="basis-1/3">
                <div 
                  className="cursor-pointer relative p-1 hover:scale-105 transition-all duration-200" 
                  onClick={() => handleProductClick(relatedProduct.id)}
                >
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium text-center truncate">
                    {relatedProduct.name}
                  </div>
                  <button 
                    className="absolute bottom-2 right-2 p-2 bg-green-500 rounded-full shadow-md hover:bg-green-600 transition-all duration-200 hover:scale-110" 
                    onClick={(e) => handleAddToCart(e, relatedProduct)} 
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
      </div>
    </div>
  );
};

export default RelatedProducts;
