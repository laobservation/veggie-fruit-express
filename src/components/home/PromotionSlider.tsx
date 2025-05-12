
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slide } from '@/types/slider'; 
import { useSlider } from '@/hooks/use-slider';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
          {slides.map((slide) => {
            // Create the slide content
            const SlideContent = () => (
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
                
                {/* Title and CTA overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className={`text-white font-semibold text-sm md:text-base max-w-[80%] drop-shadow-md ${
                    slide.position === 'center' ? 'mx-auto text-center' :
                    slide.position === 'right' ? 'ml-auto text-right' : 'text-left'
                  }`}>
                    {slide.title}
                  </div>
                  
                  {/* Call to Action Button */}
                  {slide.show_button !== false && slide.action_url && (
                    <div className={`mt-2 ${
                      slide.position === 'center' ? 'text-center mx-auto' :
                      slide.position === 'right' ? 'text-right ml-auto' : 'text-left'
                    }`}>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="text-xs bg-white text-black hover:bg-gray-100 shadow-md"
                        asChild
                      >
                        <Link to={slide.action_url}>
                          {slide.call_to_action || 'Shop Now'}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );

            // If there's an action_url, wrap the content in a Link
            return slide.action_url ? (
              <Link 
                to={slide.action_url} 
                key={slide.id}
                className="block flex-shrink-0"
                style={{ minWidth: isMobile ? '100%' : '33.333%' }}
              >
                <SlideContent />
              </Link>
            ) : (
              <div 
                key={slide.id} 
                className="block flex-shrink-0" 
                style={{ minWidth: isMobile ? '100%' : '33.333%' }}
              >
                <SlideContent />
              </div>
            );
          })}
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
              className={`w-2 h-2 rounded-full transition-all duration-300 relative ${
                currentSlide === index 
                  ? "bg-veggie-secondary scale-125 shadow-glow" 
                  : "bg-veggie-light/80 hover:bg-veggie-light"
              }`}
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
