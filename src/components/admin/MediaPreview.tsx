
import React from 'react';

interface MediaPreviewProps {
  mediaType: 'image' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  mediaType, 
  imageUrl, 
  videoUrl,
  autoplay = false,
  muted = true,
  controls = true
}) => {
  if (mediaType === 'video' && videoUrl) {
    // Extract video ID from YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(youtubeRegex);
    const videoId = match ? match[1] : null;
    
    if (videoId) {
      return (
        <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-4">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&mute=${muted ? '1' : '0'}&controls=${controls ? '1' : '0'}`}
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  } else if (mediaType === 'image' && imageUrl) {
    return (
      <div className="aspect-square w-full rounded overflow-hidden bg-gray-100 mb-4">
        <img 
          src={imageUrl} 
          alt="Aperçu du produit" 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.svg';
          }}
        />
      </div>
    );
  }
  
  return null;
};

export default MediaPreview;
