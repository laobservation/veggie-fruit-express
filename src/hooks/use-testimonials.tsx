
import { useState, useEffect, useRef } from 'react';
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

export const useTestimonials = () => {
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [autoplayInitiated, setAutoplayInitiated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{[key: string]: HTMLVideoElement}>({});

  useEffect(() => {
    loadVideos();
  }, []);

  // Intersection Observer for autoplay when section comes into view
  useEffect(() => {
    if (!sectionRef.current || videos.length === 0 || autoplayInitiated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !autoplayInitiated) {
            const firstVideo = videos[0];
            if (firstVideo) {
              setPlayingVideo(firstVideo.id);
              setAutoplayInitiated(true);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videos, autoplayInitiated]);

  // Auto-cycle through videos every 5 seconds when autoplay is active
  useEffect(() => {
    if (!playingVideo || videos.length <= 1) return;

    const interval = setInterval(() => {
      const currentIndex = videos.findIndex(v => v.id === playingVideo);
      const nextIndex = (currentIndex + 1) % videos.length;
      setPlayingVideo(videos[nextIndex].id);
    }, 5000);

    return () => clearInterval(interval);
  }, [playingVideo, videos]);

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
    
    const videoSrc = getVideoSrc(video);
    return videoSrc;
  };

  const handleVideoClick = (video: TestimonialVideo) => {
    if (video.enable_redirect && video.redirect_url) {
      window.open(video.redirect_url, '_blank');
    } else {
      setPlayingVideo(video.id === playingVideo ? null : video.id);
    }
  };

  const handleMouseEnter = (videoId: string) => {
    setHoveredVideo(videoId);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  return {
    videos,
    loading,
    playingVideo,
    hoveredVideo,
    sectionRef,
    videoRefs,
    getVideoSrc,
    getThumbnail,
    handleVideoClick,
    handleMouseEnter,
    handleMouseLeave,
    setPlayingVideo
  };
};
