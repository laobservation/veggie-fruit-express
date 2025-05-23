
import React, { useRef, useState } from 'react';
import { Product } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { useEffect } from 'react';

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
  };

  const handleProductClick = (productId: string, productName: string) => {
    const slug = productName.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    navigate(`/product/${productId}/${slug}`);
  };

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  if (products.length === 0) {
    return null;
  }

  const canScrollPrev = current > 1;
  const canScrollNext = current < count;

  return (
    <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg px-0 mx-0 my-0 py-[6px]">Autres {categoryText}</h2>
        
        <div className="flex items-center gap-3">
          {/* Slide indicators */}
          <div className="flex gap-1">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  i === current - 1 ? 'bg-green-500 w-4' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev} 
              disabled={!canScrollPrev}
              className={`p-1.5 rounded-full border-2 transition-all duration-200 ${
                canScrollPrev
                  ? 'border-green-500 text-green-600 hover:bg-green-50 hover:scale-110 shadow-sm hover:shadow-md'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous products"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={scrollNext} 
              disabled={!canScrollNext}
              className={`p-1.5 rounded-full border-2 transition-all duration-200 ${
                canScrollNext
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
      
      <div className="relative">
        <Carousel 
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
        >
          <CarouselContent>
            {products.map((relatedProduct) => (
              <CarouselItem key={relatedProduct.id} className="basis-1/3">
                <div 
                  className="cursor-pointer relative p-1 hover:scale-105 transition-all duration-200" 
                  onClick={() => handleProductClick(relatedProduct.id, relatedProduct.name)}
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
        </Carousel>
      </div>
    </div>
  );
};

export default RelatedProducts;
