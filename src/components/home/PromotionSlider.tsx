
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slide } from '@/types/slider'; 
import { useSlider } from '@/hooks/use-slider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
              className={`flex-shrink-0 w-full md:w-1/3 h-48 relative rounded-xl overflow-hidden`}
              style={{ 
                minWidth: isMobile ? '100%' : '33.333%',
              }}
            >
              {/* Image background */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Call to action button - Moved to bottom */}
              <div className={`absolute inset-x-0 bottom-4 flex items-center justify-center`}>
                <Button 
                  variant="default" 
                  className={`${slide.color} border-2 border-white hover:opacity-90 text-white font-bold px-6 py-2 shadow-md`}
                >
                  {slide.callToAction || 'Shop Now'}
                </Button>
              </div>
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
