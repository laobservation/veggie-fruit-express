
import React from 'react';

interface LazyYouTubePlayerProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
  loading?: "lazy" | "eager";
}

const LazyYouTubePlayer: React.FC<LazyYouTubePlayerProps> = ({
  videoId,
  title,
  autoplay = false,
  controls = true,
  loading = "lazy"
}) => {
  // Security: Sanitize video ID to prevent XSS
  const sanitizedVideoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Security: Sanitize title to prevent XSS
  const sanitizedTitle = title.replace(/[<>]/g, '');
  
  // Security: Validate video ID format
  if (!sanitizedVideoId || sanitizedVideoId.length < 10 || sanitizedVideoId.length > 15) {
    console.error('Invalid YouTube video ID:', videoId);
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Video indisponible</div>;
  }
  
  const embedUrl = `https://www.youtube.com/embed/${sanitizedVideoId}?autoplay=${autoplay ? '1' : '0'}&mute=${autoplay ? '1' : '0'}&controls=${controls ? '1' : '0'}&rel=0&modestbranding=1&origin=${window.location.origin}`;

  return (
    <iframe
      src={embedUrl}
      title={sanitizedTitle}
      className="w-full h-full object-cover"
      frameBorder="0"
      loading={loading}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      // Security enhancements
      sandbox="allow-scripts allow-same-origin allow-presentation"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
};

export default LazyYouTubePlayer;
