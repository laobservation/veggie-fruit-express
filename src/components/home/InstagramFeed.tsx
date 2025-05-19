
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useInView } from 'react-intersection-observer';

interface InstagramPost {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string;
}

interface InstagramFeedProps {
  posts: InstagramPost[];
  isLoading?: boolean;
}

const InstagramFeed: React.FC<InstagramFeedProps> = ({ posts, isLoading = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  
  const handleVideoRef = (id: string, element: HTMLVideoElement | null) => {
    if (element) {
      videoRefs.current[id] = element;
    }
  };
  
  const handleVideoClick = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;
    
    if (video.paused) {
      // Pause all other videos first
      Object.entries(videoRefs.current).forEach(([videoId, videoEl]) => {
        if (videoId !== id && videoEl && !videoEl.paused) {
          videoEl.pause();
          setIsPlaying(prev => ({ ...prev, [videoId]: false }));
        }
      });
      
      // Play this video
      video.play().then(() => {
        setIsPlaying(prev => ({ ...prev, [id]: true }));
      }).catch(error => {
        console.error("Error playing video:", error);
      });
    } else {
      video.pause();
      setIsPlaying(prev => ({ ...prev, [id]: false }));
    }
  };
  
  useEffect(() => {
    // Pause videos when they're not in view
    if (!inView) {
      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (video && !video.paused) {
          video.pause();
          setIsPlaying(prev => ({ ...prev, [id]: false }));
        }
      });
    }
  }, [inView]);
  
  if (isLoading) {
    return (
      <div className="py-10 px-4" ref={ref}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Notre Instagram</h2>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return null;
  }
  
  return (
    <div className="py-10 px-4 bg-white" ref={ref}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Notre Instagram</h2>
          <a 
            href="https://www.instagram.com/akhdarma/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
          >
            <Instagram size={20} />
            <span className="text-sm font-medium">@akhdarma</span>
          </a>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {posts.map((post) => (
              <CarouselItem key={post.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                  <video
                    ref={(el) => handleVideoRef(post.id, el)}
                    src={post.videoUrl}
                    poster={post.thumbnailUrl || undefined}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleVideoClick(post.id)}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 hover:bg-white"
                      onClick={() => handleVideoClick(post.id)}
                    >
                      {isPlaying[post.id] ? 'Pause' : 'Play'}
                    </Button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-white/80" />
          <CarouselNext className="right-2 bg-white/80" />
        </Carousel>
        
        <div className="flex justify-center mt-6">
          <a 
            href="https://www.instagram.com/akhdarma/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-tr from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-colors"
          >
            <Instagram size={18} />
            <span className="text-sm font-medium">Voir plus sur Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed;
