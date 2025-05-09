
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSlider } from '@/hooks/use-slider';
import { Slide } from '@/types/slider';
import { Link } from 'react-router-dom';

interface PromotionSliderProps {
  customSlides?: Slide[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ customSlides }) => {
  const { slides: fetchedSlides, loading } = useSlider();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);

  // Use either custom slides passed as props or fetched slides
  useEffect(() => {
    if (customSlides) {
      setSlides(customSlides);
    } else if (fetchedSlides.length > 0) {
      setSlides(fetchedSlides);
    }
  }, [customSlides, fetchedSlides]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading || slides.length === 0) {
    return (
      <div className="h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div 
        className="flex transition-transform duration-700 h-full" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id || index} className="min-w-full h-full flex-shrink-0">
            <div 
              className="w-full h-full bg-cover bg-center flex items-center" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={`container mx-auto px-6 ${
                slide.position === 'left' ? 'text-left' : 
                slide.position === 'right' ? 'text-right' : 
                'text-center'
              }`}>
                <div className={`max-w-lg ${
                  slide.position === 'left' ? '' : 
                  slide.position === 'right' ? 'ml-auto' : 
                  'mx-auto'
                }`}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                  {slide.showButton && (
                    <Button asChild className={`${slide.color} hover:opacity-90 text-white`}>
                      <Link to="/fruits">{slide.callToAction}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-green-500' : 'bg-white bg-opacity-50'
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
