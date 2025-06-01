
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTestimonialManager } from '@/hooks/use-testimonial-manager';
import TestimonialForm from './testimonials/TestimonialForm';
import TestimonialListItem from './testimonials/TestimonialListItem';

const TestimonialManager = () => {
  const {
    videos,
    loading,
    newVideo,
    updateFormData,
    handleVideoUpload,
    removeUploadedVideo,
    addVideo,
    deleteVideo,
    toggleVideoStatus,
    toggleRedirect
  } = useTestimonialManager();

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle vidéo témoignage</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm
            formData={newVideo}
            onFormChange={updateFormData}
            onVideoUploaded={handleVideoUpload}
            onRemoveVideo={removeUploadedVideo}
            onSubmit={addVideo}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vidéos témoignages ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune vidéo témoignage ajoutée.</p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <TestimonialListItem
                  key={video.id}
                  video={video}
                  onToggleStatus={toggleVideoStatus}
                  onToggleRedirect={toggleRedirect}
                  onDelete={deleteVideo}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialManager;
