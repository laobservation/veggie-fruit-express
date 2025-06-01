
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Edit } from 'lucide-react';

type SlidePosition = 'left' | 'right' | 'center';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  position: SlidePosition;
}

interface SlidePreviewProps {
  slides: HeroSlide[];
  onEditSlide: (slide: HeroSlide) => void;
  onDeleteSlide: (slideId: string) => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({
  slides,
  onEditSlide,
  onDeleteSlide
}) => {
  return (
    <Carousel className="w-full max-w-4xl mx-auto mb-8">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center flex items-center" 
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                }}
              >
                <div className={`container mx-auto px-6 h-full flex items-center ${
                  slide.position === 'left' ? 'justify-start' : 
                  slide.position === 'right' ? 'justify-end' : 
                  'justify-center'
                }`}>
                  <div className="max-w-lg text-center md:text-left bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                    <h1 className="text-2xl font-bold text-white mb-2">{slide.title}</h1>
                    <p className="text-white mb-4">{slide.subtitle}</p>
                    <Button className="bg-veggie-primary hover:bg-veggie-dark text-white">
                      {slide.ctaText}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-white"
                    onClick={() => onEditSlide(slide)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => onDeleteSlide(slide.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Slide {slide.id}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        <CarouselPrevious className="relative inline-flex mr-2" />
        <CarouselNext className="relative inline-flex" />
      </div>
    </Carousel>
  );
};

export default SlidePreview;
