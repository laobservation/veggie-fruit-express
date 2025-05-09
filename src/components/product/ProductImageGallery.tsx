
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductImageGalleryProps {
  mainImage?: string;  // Make this optional
  additionalImages?: string[];
  product?: Product; 
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImage = '',  // Provide default value
  additionalImages = [],
  product
}) => {
  // If product is provided, use its images
  const productMainImage = product ? product.image : mainImage;
  const productAdditionalImages = product ? product.additionalImages || [] : additionalImages;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const allImages = [productMainImage, ...(productAdditionalImages || [])].filter(Boolean);
  
  // Set up auto-switching for images
  useEffect(() => {
    // Only run autoplay if there are multiple images and user hasn't manually interacted
    if (allImages.length <= 1 || !autoplayEnabled || userInteracted) return;
    
    const autoplayTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
      
      // After the first auto-switch, disable autoplay to let user take control
      if (currentIndex === 1) {
        setAutoplayEnabled(false);
      }
    }, 3000); // Switch every 3 seconds
    
    return () => clearTimeout(autoplayTimer);
  }, [allImages.length, currentIndex, autoplayEnabled, userInteracted]);
  
  const handlePrevious = () => {
    setUserInteracted(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };
  
  const handleNext = () => {
    setUserInteracted(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };
  
  const handleThumbnailClick = (index: number) => {
    setUserInteracted(true);
    setCurrentIndex(index);
  };
  
  // Handle empty state
  if (!productMainImage && (!productAdditionalImages || productAdditionalImages.length === 0)) {
    return (
      <div className="aspect-square w-full bg-gray-100 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg aspect-square bg-white">
        <div
          className="h-full w-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {allImages.map((image, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
        </div>
        
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                index === currentIndex ? 'border-green-500' : 'border-transparent'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
