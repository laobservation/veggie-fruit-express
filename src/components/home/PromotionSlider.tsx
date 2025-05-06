
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slide } from '@/types/slider'; 
import { useSlider } from '@/hooks/use-slider';

interface PromotionSliderProps {
  customSlides?: Slide[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ customSlides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const { slides: fetchedSlides, loading } = useSlider();
  
  const slides = customSlides || fetchedSlides;

  // Auto-slide effect only for mobile
  useEffect(() => {
    if (isMobile && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isMobile, slides.length]);
  
  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };
  
  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading || slides.length === 0) {
    return (
      <div className="mb-8 h-48 bg-gray-100 rounded-xl animate-pulse"></div>
    );
  }
  
  return (
    <div className="relative mb-8">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className={`${slide.color} rounded-xl flex-shrink-0 w-full md:w-1/3 h-48 flex items-center p-6 text-white relative`}
              style={{ 
                minWidth: isMobile ? '100%' : '33.333%',
                backgroundImage: slide.image ? `url(${slide.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/30 rounded-xl"></div>
              <h3 className="text-2xl font-bold max-w-[70%] leading-tight relative z-10">{slide.title}</h3>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows for desktop */}
      {slides.length > 1 && (
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
      )}
      
      {/* Pagination dots - only for mobile */}
      {isMobile && slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
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
