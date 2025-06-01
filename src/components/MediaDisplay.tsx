
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Product } from '@/types/product';

interface MediaDisplayProps {
  product: Product;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  loading?: "lazy" | "eager";
  isHero?: boolean;
  priority?: boolean;
}

// Lazy load YouTube component for better performance
const LazyYouTubePlayer = lazy(() => import('./LazyYouTubePlayer'));

const MediaDisplay: React.FC<MediaDisplayProps> = ({ 
  product, 
  className = "", 
  autoplay = false,
  controls = true,
  loading = "lazy",
  isHero = false,
  priority = false
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (product.videoUrl) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = product.videoUrl.match(youtubeRegex);
      setVideoId(match ? match[1] : null);
    }
  }, [product.videoUrl]);

  // Display YouTube video if videoUrl exists and is valid
  if (videoId && product.videoUrl) {
    return (
      <div className={`w-full h-full ${className}`}>
        <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
          <LazyYouTubePlayer
            videoId={videoId}
            title={product.name}
            autoplay={autoplay}
            controls={controls}
            loading={loading}
          />
        </Suspense>
      </div>
    );
  }

  // Display image with optimized loading and security improvements
  return (
    <div className={`w-full h-full ${className} relative`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={product.image}
        alt={product.name}
        className={`${className} object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={isHero || priority ? "eager" : loading}
        fetchPriority={isHero || priority ? "high" : "auto"}
        decoding={isHero ? "sync" : "async"}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          console.error('Image failed to load:', product.image);
          (e.target as HTMLImageElement).src = '/placeholder.svg';
          setImageLoaded(true);
        }}
        // Security: Prevent potential XSS attacks
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default MediaDisplay;
