
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ExternalLink, Instagram, Youtube } from 'lucide-react';
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
}

const TestimonialsSection = () => {
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showContinuePrompt, setShowContinuePrompt] = useState<string | null>(null);
  const [hasStartedAutoplay, setHasStartedAutoplay] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  // Intersection Observer for automatic video playback
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedAutoplay && videos.length > 0) {
            // Start playing the first video automatically
            const firstVideo = videos[0];
            if (firstVideo) {
              console.log('Starting autoplay for first video:', firstVideo.id);
              playVideo(firstVideo.id);
              setHasStartedAutoplay(true);
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [videos, hasStartedAutoplay]);

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

  const extractVideoId = (url: string, platform: string) => {
    try {
      switch (platform) {
        case 'youtube':
          const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          return youtubeMatch ? youtubeMatch[1] : null;
        case 'instagram':
          const instagramMatch = url.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/);
          return instagramMatch ? instagramMatch[1] : null;
        case 'tiktok':
          const tiktokMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
          return tiktokMatch ? tiktokMatch[1] : null;
        default:
          return null;
      }
    } catch {
      return null;
    }
  };

  const getEmbedUrl = (video: TestimonialVideo) => {
    const videoId = extractVideoId(video.video_url, video.platform);
    
    switch (video.platform) {
      case 'youtube':
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0` : null;
      case 'instagram':
        // Instagram doesn't allow iframe embedding, return null to show as image with link
        return null;
      case 'tiktok':
        // TikTok has limited embedding support
        return null;
      case 'facebook':
        // Facebook videos need special handling
        return null;
      default:
        return null;
    }
  };

  const getThumbnail = (video: TestimonialVideo) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    
    const videoId = extractVideoId(video.video_url, video.platform);
    
    switch (video.platform) {
      case 'youtube':
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const playVideo = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const embedUrl = getEmbedUrl(video);
    
    if (embedUrl) {
      // For platforms that support embedding (like YouTube)
      setPlayingVideo(videoId);
      
      // Show continue prompt after 5 seconds
      setTimeout(() => {
        setShowContinuePrompt(videoId);
      }, 5000);
    } else {
      // For platforms that don't support embedding, open directly
      window.open(video.video_url, '_blank');
    }
  };

  const continueWatching = (video: TestimonialVideo) => {
    window.open(video.video_url, '_blank');
    setShowContinuePrompt(null);
    setPlayingVideo(null);
  };

  const closePrompt = (videoId: string) => {
    setShowContinuePrompt(null);
    setPlayingVideo(null);
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
            const embedUrl = getEmbedUrl(video);
            const thumbnail = getThumbnail(video);
            
            return (
              <div key={video.id} className="group relative">
                <Card className="overflow-hidden h-full bg-black rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0 h-full relative">
                    <div className="aspect-[9/16] w-full relative">
                      {/* Video Iframe for supported platforms */}
                      {playingVideo === video.id && embedUrl && (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full object-cover rounded-2xl"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}

                      {/* Thumbnail/Preview when not playing */}
                      {playingVideo !== video.id && (
                        <>
                          <div 
                            className="absolute inset-0 bg-cover bg-center rounded-2xl"
                            style={{ 
                              backgroundImage: thumbnail ? `url(${thumbnail})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                          />
                          
                          {/* Play Button Overlay */}
                          <div 
                            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/50"
                            onClick={() => playVideo(video.id)}
                          >
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-lg">
                              <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Continue Watching Prompt */}
                      {showContinuePrompt === video.id && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
                          <div className="text-center space-y-4 animate-fade-in">
                            <div className="w-12 h-12 rounded-full bg-white mx-auto flex items-center justify-center mb-4">
                              {getPlatformIcon(video.platform)}
                            </div>
                            <h3 className="text-white font-semibold text-lg">Continuer sur {video.platform}</h3>
                            <p className="text-white/80 text-sm">Regardez la vidéo complète sur la plateforme originale</p>
                            <div className="flex gap-3 justify-center">
                              <Button
                                onClick={() => continueWatching(video)}
                                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-6 py-2 rounded-full"
                              >
                                Continuer à regarder
                              </Button>
                              <Button
                                onClick={() => closePrompt(video.id)}
                                variant="outline"
                                className="border-white/30 text-white hover:bg-white/10 px-4 py-2 rounded-full"
                              >
                                Fermer
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Platform Badge */}
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                        {getPlatformIcon(video.platform)}
                        <span className="text-white text-xs font-medium capitalize">{video.platform}</span>
                      </div>

                      {/* Progress Bar (when playing) */}
                      {playingVideo === video.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500 animate-testimonial-progress" />
                        </div>
                      )}
                    </div>
                    
                    {/* Video Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{video.title}</h3>
                      <p className="text-white/70 text-sm capitalize">@{video.platform}</p>
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
