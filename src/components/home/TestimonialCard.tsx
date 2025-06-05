
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ExternalLink } from 'lucide-react';

interface TestimonialVideo {
  id: string;
  title: string;
  video_url: string;
  platform: string;
  thumbnail_url: string | null;
  is_active: boolean;
  display_order: number;
  video_file_path: string | null;
  redirect_url: string | null;
  enable_redirect: boolean | null;
}

interface TestimonialCardProps {
  video: TestimonialVideo;
  videoSrc: string | null;
  thumbnail: string | null;
  isPlaying: boolean;
  isHovered: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onVideoClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onStopPlaying: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  video,
  videoSrc,
  thumbnail,
  isPlaying,
  isHovered,
  videoRef,
  onVideoClick,
  onMouseEnter,
  onMouseLeave,
  onStopPlaying
}) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);

  // Handle video playback based on hover/touch state
  useEffect(() => {
    const videoElement = internalVideoRef.current;
    if (!videoElement || !videoSrc) return;

    if (isHovered || isPlaying) {
      videoElement.currentTime = 0;
      videoElement.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }, [isHovered, isPlaying, videoSrc]);

  // Set up video ref for parent component
  useEffect(() => {
    if (internalVideoRef.current) {
      videoRef(internalVideoRef.current);
    }
  }, [videoRef]);

  const handleCardClick = () => {
    if (video.enable_redirect && video.redirect_url) {
      onVideoClick();
    } else {
      // For non-redirect videos, clicking toggles play state
      if (isPlaying) {
        onStopPlaying();
      } else {
        onVideoClick();
      }
    }
  };

  const handleTouchStart = () => {
    onMouseEnter(); // Trigger hover effect on touch
  };

  const handleTouchEnd = () => {
    // Delay to allow video to play briefly
    setTimeout(() => {
      onMouseLeave();
    }, 2000);
  };

  return (
    <div className="group relative">
      <Card className="overflow-hidden h-full bg-black rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
        <CardContent className="p-0 h-full relative">
          <div 
            className="aspect-[9/16] w-full relative cursor-pointer"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleCardClick}
          >
            {/* Main Video Element */}
            {videoSrc && (
              <video
                ref={internalVideoRef}
                className="w-full h-full object-cover rounded-lg"
                src={videoSrc}
                muted
                loop
                playsInline
                preload="metadata"
                poster={thumbnail || undefined}
                onLoadStart={() => console.log('Video loading started')}
              />
            )}

            {/* Fallback for no video */}
            {!videoSrc && (
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-lg"
                style={{ 
                  backgroundImage: thumbnail 
                    ? `url(${thumbnail})` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
            )}

            {/* Play Button Overlay - only show when not playing/hovering */}
            {!isPlaying && !isHovered && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 hover:bg-black/50">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-lg">
                  {video.enable_redirect ? (
                    <ExternalLink className="w-6 h-6 text-gray-800" />
                  ) : (
                    <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
                  )}
                </div>
              </div>
            )}

            {/* Platform Badge */}
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <span className="text-white text-xs font-medium">
                {video.platform === 'upload' ? 'Vidéo' : video.platform}
              </span>
            </div>

            {/* Redirect indicator */}
            {video.enable_redirect && (
              <div className="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-sm rounded-full px-1 py-1">
                <ExternalLink className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Playing indicator */}
            {(isPlaying || isHovered) && (
              <div className="absolute bottom-2 right-2 bg-red-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
            <p className="text-white/70 text-xs">
              {video.platform === 'upload' ? 'Témoignage client' : `@${video.platform}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialCard;
