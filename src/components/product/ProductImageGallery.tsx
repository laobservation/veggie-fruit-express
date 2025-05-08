
import React, { useState } from 'react';
import { Product } from '@/types/product';
import MediaDisplay from '@/components/MediaDisplay';

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  
  // Combine main image with additional images for the gallery
  const allImages = [product.image, ...(product.additionalImages || [])];
  
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
              onClick={() => setSelectedImage(img)}
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
