
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
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

  const getEmbedUrl = (url: string, platform: string) => {
    try {
      switch (platform) {
        case 'youtube':
          const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          return youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : url;
        case 'instagram':
          return `${url.replace(/\/$/, '')}/embed`;
        case 'tiktok':
          const tiktokMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
          return tiktokMatch ? `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` : url;
        case 'facebook':
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
        default:
          return url;
      }
    } catch {
      return url;
    }
  };

  const getThumbnail = (video: TestimonialVideo) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    
    // Fallback thumbnails based on platform
    switch (video.platform) {
      case 'youtube':
        const youtubeMatch = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return youtubeMatch ? `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg` : null;
      default:
        return null;
    }
  };

  const openVideo = (video: TestimonialVideo) => {
    const embedUrl = getEmbedUrl(video.video_url, video.platform);
    window.open(embedUrl, '_blank');
  };

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-0 bg-white">
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
            <div key={video.id} className="group">
              <Card className="overflow-hidden h-full">
                <CardContent className="p-0 h-full">
                  <div 
                    className="aspect-video w-full relative cursor-pointer"
                    onClick={() => openVideo(video)}
                  >
                    {getThumbnail(video) ? (
                      <>
                        <img 
                          src={getThumbnail(video) as string} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-all">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-green-600 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 rounded-full bg-green-600 mx-auto flex items-center justify-center mb-2">
                            <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                          </div>
                          <p className="text-sm text-gray-600">
                            {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">Via {video.platform}</p>
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
