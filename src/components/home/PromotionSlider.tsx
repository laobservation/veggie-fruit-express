
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slide } from '@/types/slider'; 
import { useSlider } from '@/hooks/use-slider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
      <div className="overflow-hidden rounded-xl">
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
              {/* Image background - Removed black fade overlay */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Title overlay - Now without dark background */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className={`text-white font-semibold text-sm md:text-base max-w-[80%] drop-shadow-md ${
                  slide.position === 'center' ? 'mx-auto text-center' :
                  slide.position === 'right' ? 'ml-auto text-right' : 'text-left'
                }`}>
                  {slide.title}
                </div>
                
                {/* Enhanced stylish call to action button - Now conditional */}
                {slide.showButton && (
                  <div className={`w-full flex ${
                    slide.position === 'center' ? 'justify-center' :
                    slide.position === 'right' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Button 
                      variant="default" 
                      size="sm"
                      className={`${slide.color} backdrop-blur-sm bg-opacity-80 border border-white/50 hover:bg-opacity-100 hover:scale-105 text-white font-bold shadow-lg transition-all duration-300 rounded-lg px-4`}
                    >
                      {slide.callToAction || 'Shop Now'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      {slides.length > 1 && (
        <div className="hidden md:block">
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Stylish pagination dots with light green color */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 top-0 right-4 flex flex-col justify-center items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 relative",
                currentSlide === index 
                  ? "bg-veggie-secondary scale-125 shadow-glow" 
                  : "bg-veggie-light/80 hover:bg-veggie-light"
              )}
              style={{ 
                boxShadow: currentSlide === index ? '0 0 5px 1px rgba(139, 195, 74, 0.6)' : 'none',
                transform: `scale(${currentSlide === index ? 1.25 : 1})` 
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionSlider;
