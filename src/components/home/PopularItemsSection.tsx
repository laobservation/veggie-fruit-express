
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import '@/components/ui/plus-animation.css';
import { Button } from '@/components/ui/button';

interface PopularItemsSectionProps {
  products: Product[];
  isLoading: boolean;
  showAll?: boolean;
  title: string;
  category?: string;
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  products,
  isLoading,
  showAll = false,
  title,
  category
}) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [displayCount, setDisplayCount] = useState(4); // Start with 4 products
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort products with newest first if showing all
  const sortedProducts = [...products].sort((a, b) => {
    return Number(b.id) - Number(a.id);
  });

  // Filter products by category if specified
  const filteredProducts = category ? sortedProducts.filter(product => product.category === category) : sortedProducts;

  // For sliding functionality when showAll is false, we work with limited products
  // For grid display when showAll is true, we show more products
  const productsToShow = showAll ? filteredProducts.slice(0, displayCount) : filteredProducts;
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(productsToShow.length / itemsPerSlide);
  
  // Get current slide products for sliding mode
  const currentSlideProducts = showAll 
    ? productsToShow 
    : productsToShow.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide);

  const hasMoreProducts = displayCount < filteredProducts.length;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 4, filteredProducts.length)); // Show 4 more products
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? totalSlides - 1 : prev - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  // Create SEO-friendly slug from product name
  const createSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  if (filteredProducts.length === 0 && category) {
    return null;
  }

  const canSlidePrev = !showAll && totalSlides > 1;
  const canSlideNext = !showAll && totalSlides > 1;

  return (
    <div className="mb-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title} :</h2>
        {!showAll && (
          <div className="flex gap-2">
            <button 
              onClick={handlePrevSlide}
              disabled={!canSlidePrev}
              className={`p-1 rounded-full border-2 transition-all duration-200 ${
                canSlidePrev 
                  ? 'border-green-500 text-green-600 hover:bg-green-50 hover:scale-110 shadow-sm hover:shadow-md' 
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous products"
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={handleNextSlide}
              disabled={!canSlideNext}
              className={`p-1 rounded-full border-2 transition-all duration-200 ${
                canSlideNext 
                  ? 'border-green-500 text-green-600 hover:bg-green-50 hover:scale-110 shadow-sm hover:shadow-md' 
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Next products"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Slide indicators - only for non-showAll mode */}
      {!showAll && totalSlides > 1 && (
        <div className="flex justify-center mb-4 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-green-500 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
      
      <div 
        ref={containerRef}
        className={`grid ${showAll ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-2 md:grid-cols-4'} gap-3 transition-all duration-500 ease-in-out`}
      >
        {isLoading ? (
          Array(4).fill(0).map((_, index) => ( // Show 4 loading placeholders
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          currentSlideProducts.map((product) => {
            const productUrl = `/product/${product.id}/${createSlug(product.name)}`;
            return (
              <Link 
                key={product.id} 
                to={productUrl} 
                className="bg-white p-4 rounded-lg shadow-sm relative mx-0 my-0 px-[8px] py-[8px] hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <button 
                  onClick={(e) => handleFavoriteClick(e, product)} 
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/80 z-10 hover:bg-white transition-all duration-200"
                >
                  <Heart 
                    className={`h-4 w-4 transition-all duration-200 ${
                      isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} 
                  />
                </button>
                <div className="flex justify-center mb-3 text-green-500 bg-white px-0 py-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-28 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium mb-1 text-center">{product.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-sm text-gray-500 mr-1">{product.unit}</span>
                    <span className="text-sm text-gray-500 mr-1">/</span>
                    <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)} 
                    aria-label="Ajouter au panier" 
                    className="bg-green-500 rounded-full flex items-center px-[15px] mx-0 my-0 py-[5px] hover:bg-green-600 transition-all duration-200 hover:scale-105"
                  >
                    <span className="text-white font-bold text-xs">Ajouter au panier</span>
                  </button>
                </div>
              </Link>
            );
          })
        )}
      </div>
      
      {hasMoreProducts && showAll && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleShowMore} 
            variant="outline" 
            className="border-green-500 text-base font-medium rounded-2xl bg-white text-green-500 hover:bg-green-50 transition-all duration-200 hover:scale-105"
          >
            Afficher plus
          </Button>
        </div>
      )}
    </div>
  );
};

export default PopularItemsSection;
