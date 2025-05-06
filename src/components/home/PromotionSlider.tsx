
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSlider } from '@/hooks/use-slider';
import { Slide } from '@/types/slider';

interface PromotionSliderProps {
  customSlides?: Slide[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ customSlides }) => {
  const { slides: fetchedSlides, loading } = useSlider();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  
  const slides = customSlides || fetchedSlides;
  
  useEffect(() => {
    // Reset index if slides change
    setCurrentIndex(0);
    
    // Auto-advance slide every 5 seconds unless we're using custom slides (in preview mode)
    if (!customSlides) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(timer);
    }
  }, [customSlides, slides.length]);
  
  const nextSlide = () => {
    if (animating || slides.length <= 1) return;
    
    setAnimating(true);
    setCurrentIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
    
    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };
  
  const prevSlide = () => {
    if (animating || slides.length <= 1) return;
    
    setAnimating(true);
    setCurrentIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
    
    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // If the swipe is significant enough (> 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(); // Swipe left, go to next slide
      } else {
        prevSlide(); // Swipe right, go to previous slide
      }
    }
  };
  
  // Handle loading state
  if (loading && !customSlides) {
    return (
      <div className="relative h-[400px] flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Handle empty slides
  if (slides.length === 0) {
    return null;
  }
  
  const currentSlide = slides[currentIndex];
  
  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="w-full h-[400px] md:h-[500px] bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentSlide.image})`
        }}
      >
        <div className={`container mx-auto px-6 h-full flex items-center ${
          currentSlide.position === 'left' ? 'justify-start' : 
          currentSlide.position === 'right' ? 'justify-end' : 
          'justify-center'
        }`}>
          <div className={`max-w-lg text-center md:text-left ${currentSlide.color} p-6 rounded-lg bg-opacity-80`}>
            <h1 className="text-3xl font-bold text-white mb-4">{currentSlide.title}</h1>
            {currentSlide.showButton && (
              <Link to={currentSlide.actionUrl || '/fruits'}>
                <Button className="bg-white text-emerald-800 hover:bg-gray-100">
                  {currentSlide.callToAction || 'Acheter maintenant'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-black/20 text-white hover:bg-black/40"
          onClick={prevSlide}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-black/20 text-white hover:bg-black/40"
          onClick={nextSlide}
        >
          <ArrowRight className="h-6 w-6" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionSlider;
