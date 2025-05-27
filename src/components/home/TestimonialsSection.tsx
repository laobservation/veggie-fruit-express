
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
  const videoRefs = useRef<{[key: string]: HTMLVideoElement}>({});

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

  const getVideoPreviewUrl = (url: string, platform: string) => {
    // For demo purposes, we'll use placeholder videos
    // In production, you'd need to extract actual video files or use platform APIs
    return 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4';
  };

  const getThumbnail = (video: TestimonialVideo) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    
    switch (video.platform) {
      case 'youtube':
        const youtubeMatch = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeMatch ? `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg` : null;
      case 'instagram':
        // For Instagram, we'll use a placeholder since we can't easily extract thumbnails
        return null;
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
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      setPlayingVideo(videoId);
      videoElement.play();
      
      // Stop video after 5 seconds and show continue prompt
      setTimeout(() => {
        videoElement.pause();
        setShowContinuePrompt(videoId);
      }, 5000);
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
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.currentTime = 0;
    }
  };

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-0 bg-gradient-to-br from-gray-50 to-gray-100">
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
          {videos.map(video => (
            <div key={video.id} className="group relative">
              <Card className="overflow-hidden h-full bg-black rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
                <CardContent className="p-0 h-full relative">
                  <div className="aspect-[9/16] w-full relative">
                    {/* Video Element - Hidden initially */}
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[video.id] = el;
                      }}
                      className="w-full h-full object-cover rounded-2xl"
                      muted
                      playsInline
                      preload="metadata"
                      style={{ display: playingVideo === video.id ? 'block' : 'none' }}
                    >
                      <source src={getVideoPreviewUrl(video.video_url, video.platform)} type="video/mp4" />
                    </video>

                    {/* Thumbnail/Preview when not playing */}
                    {playingVideo !== video.id && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl"
                          style={{ 
                            backgroundImage: getThumbnail(video) ? `url(${getThumbnail(video)})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
