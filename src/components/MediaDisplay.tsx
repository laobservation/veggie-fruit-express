
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';

interface MediaDisplayProps {
  product: Product;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  loading?: "lazy" | "eager";
  isHero?: boolean;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ 
  product, 
  className = "", 
  autoplay = false, // Changed default to false for better performance
  controls = true,
  loading = "lazy",
  isHero = false
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  
  useEffect(() => {
    // Extract YouTube video ID if videoUrl exists
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
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&mute=${autoplay ? '1' : '0'}&controls=${controls ? '1' : '0'}&rel=0&modestbranding=1`}
          title={product.name}
          className="w-full h-full object-cover"
          frameBorder="0"
          loading={loading}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Display image with optimized loading
  return (
    <img
      src={product.image}
      alt={product.name}
      className={`${className} object-contain transition-opacity duration-300`}
      loading={isHero ? "eager" : loading}
      fetchPriority={isHero ? "high" : "auto"}
      decoding={isHero ? "sync" : "async"}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/placeholder.svg';
      }}
    />
  );
};

export default MediaDisplay;
