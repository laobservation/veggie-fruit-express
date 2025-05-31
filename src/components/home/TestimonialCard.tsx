
import React from 'react';
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
  return (
    <div className="group relative">
      <Card className="overflow-hidden h-full bg-black rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
        <CardContent className="p-0 h-full relative">
          <div className="aspect-[9/16] w-full relative">
            {/* Video Player */}
            {videoSrc && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-2xl"
                src={videoSrc}
                autoPlay={isPlaying}
                muted
                loop
                playsInline
                preload="metadata"
                poster={thumbnail || undefined}
                onLoadStart={() => console.log('Video loading started')}
                style={{ display: isPlaying || isHovered ? 'block' : 'none' }}
              />
            )}

            {/* Thumbnail when not playing/hovered */}
            {(!isPlaying && !isHovered) && (
              <>
                {thumbnail && videoSrc ? (
                  <video
                    className="w-full h-full object-cover rounded-2xl"
                    src={videoSrc}
                    muted
                    preload="metadata"
                    poster={thumbnail}
                  />
                ) : (
                  <div 
                    className="absolute inset-0 bg-cover bg-center rounded-2xl"
                    style={{ 
                      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  />
                )}
                
                {/* Play Button Overlay */}
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/50"
                  onClick={onVideoClick}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-lg">
                    {video.enable_redirect ? (
                      <ExternalLink className="w-8 h-8 text-gray-800" />
                    ) : (
                      <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Click overlay for playing videos */}
            {isPlaying && (
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={onStopPlaying}
              />
            )}

            {/* Platform Badge */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
              <span className="text-white text-xs font-medium">
                {video.platform === 'upload' ? 'Vidéo' : video.platform}
              </span>
            </div>

            {/* Redirect indicator */}
            {video.enable_redirect && (
              <div className="absolute top-4 left-4 bg-blue-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                <ExternalLink className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Autoplay indicator */}
            {isPlaying && (
              <div className="absolute bottom-4 right-4 bg-red-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg mb-1">{video.title}</h3>
            <p className="text-white/70 text-sm">
              {video.platform === 'upload' ? 'Témoignage client' : `@${video.platform}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialCard;
