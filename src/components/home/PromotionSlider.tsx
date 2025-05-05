
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Promotion {
  id: number;
  title: string;
  color: string;
  image: string;
}

interface PromotionSliderProps {
  promotions: Promotion[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ promotions }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  
  // Auto-slide effect only for mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promotions.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isMobile, promotions.length]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative mb-8">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              className={`${promo.color} rounded-xl flex-shrink-0 w-full md:w-1/3 h-48 flex items-center p-6 text-white`}
              style={{ minWidth: isMobile ? '100%' : '33.333%' }}
            >
              <h3 className="text-2xl font-bold max-w-[50%] leading-tight">{promo.title}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows for desktop */}
      <div className="hidden md:block">
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Pagination dots - only for mobile */}
      {isMobile && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionSlider;
