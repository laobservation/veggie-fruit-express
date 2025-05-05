
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

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
  const [api, setApi] = useState<any>();
  
  // Auto-advance slides
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="mb-8 px-0">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {promotions.map((promo) => (
            <CarouselItem key={promo.id}>
              <div 
                className={`${promo.color} rounded-xl h-48 w-full flex items-center p-6 text-white`}
              >
                <h3 className="text-2xl font-bold max-w-[50%] leading-tight">{promo.title}</h3>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4 bg-white/80" />
        <CarouselNext className="right-2 md:right-4 bg-white/80" />
      </Carousel>
    </div>
  );
};

export default PromotionSlider;
