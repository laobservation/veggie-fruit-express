
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
  
  const embedUrl = `https://www.youtube.com/embed/${sanitizedVideoId}?autoplay=${autoplay ? '1' : '0'}&mute=${autoplay ? '1' : '0'}&controls=${controls ? '1' : '0'}&rel=0&modestbranding=1&origin=${window.location.origin}`;

  return (
    <iframe
      src={embedUrl}
      title={title}
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
