
import React from 'react';
import { useTestimonials } from '@/hooks/use-testimonials';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  const {
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
  } = useTestimonials();

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
              <TestimonialCard
                key={video.id}
                video={video}
                videoSrc={videoSrc}
                thumbnail={thumbnail}
                isPlaying={isPlaying}
                isHovered={isHovered}
                videoRef={(el) => {
                  if (el) videoRefs.current[video.id] = el;
                }}
                onVideoClick={() => handleVideoClick(video)}
                onMouseEnter={() => handleMouseEnter(video.id)}
                onMouseLeave={handleMouseLeave}
                onStopPlaying={() => setPlayingVideo(null)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
