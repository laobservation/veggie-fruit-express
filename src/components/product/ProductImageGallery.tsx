
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import MediaDisplay from '@/components/MediaDisplay';

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  
  // Combine main image with additional images for the gallery
  const allImages = [product.image, ...(product.additionalImages || [])];
  
  // Auto-switch images every 3 seconds if there are multiple images
  // and the user hasn't manually interacted with the gallery yet
  useEffect(() => {
    if (allImages.length <= 1 || userInteracted) return;
    
    let currentIndex = allImages.indexOf(selectedImage);
    const timerId = setTimeout(() => {
      currentIndex = (currentIndex + 1) % allImages.length;
      setSelectedImage(allImages[currentIndex]);
    }, 3000);
    
    return () => clearTimeout(timerId);
  }, [selectedImage, allImages, userInteracted]);
  
  // Handle manual image selection
  const handleImageSelect = (img: string) => {
    setUserInteracted(true);
    setSelectedImage(img);
  };
  
  return (
    <div className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm">
      {/* Main image display */}
      <div className="aspect-square">
        {product.videoUrl && selectedImage === product.image ? (
          <MediaDisplay 
            product={{...product}} 
            className="w-full h-full object-contain p-6"
            autoplay={false}
            controls={true}
          />
        ) : (
          <img 
            src={selectedImage} 
            alt={product.name} 
            className="w-full h-full object-contain p-6"
          />
        )}
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex overflow-x-auto p-3 gap-2 border-t">
          {allImages.map((img, index) => (
            <button 
              key={index}
              onClick={() => handleImageSelect(img)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                selectedImage === img ? 'border-green-500' : 'border-transparent'
              }`}
            >
              <img 
                src={img} 
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
