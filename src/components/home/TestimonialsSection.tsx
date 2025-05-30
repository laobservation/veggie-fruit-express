
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

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

const TestimonialsSection = () => {
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonial_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6);
      
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading testimonial videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoSrc = (video: TestimonialVideo) => {
    if (video.video_file_path) {
      const { data } = supabase.storage
        .from('testimonial-videos')
        .getPublicUrl(video.video_file_path);
      return data.publicUrl;
    }
    return null;
  };

  const getThumbnail = (video: TestimonialVideo) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    
    // For uploaded videos, use the first frame as thumbnail (browser will handle this)
    const videoSrc = getVideoSrc(video);
    return videoSrc;
  };

  const handleVideoClick = (video: TestimonialVideo) => {
    if (video.enable_redirect && video.redirect_url) {
      window.open(video.redirect_url, '_blank');
    } else {
      setPlayingVideo(video.id);
    }
  };

  const handleMouseEnter = (videoId: string) => {
    setHoveredVideo(videoId);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-12 px-4 md:px-0 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Témoignages de nos clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de nos produits et services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => {
            const videoSrc = getVideoSrc(video);
            const thumbnail = getThumbnail(video);
            const isPlaying = playingVideo === video.id;
            const isHovered = hoveredVideo === video.id;
            
            return (
              <div key={video.id} className="group relative">
                <Card className="overflow-hidden h-full bg-black rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0 h-full relative">
                    <div className="aspect-[9/16] w-full relative">
                      {/* Video Player */}
                      {videoSrc && (isPlaying || isHovered) && (
                        <video
                          className="w-full h-full object-cover rounded-2xl"
                          src={videoSrc}
                          autoPlay={isPlaying}
                          muted
                          loop={isPlaying}
                          playsInline
                          preload="metadata"
                          onLoadStart={() => console.log('Video loading started')}
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
                            onClick={() => handleVideoClick(video)}
                            onMouseEnter={() => handleMouseEnter(video.id)}
                            onMouseLeave={handleMouseLeave}
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
                          onClick={() => setPlayingVideo(null)}
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
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
