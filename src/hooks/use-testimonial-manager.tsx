
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  video_file_size: number | null;
  redirect_url: string | null;
  enable_redirect: boolean | null;
}

interface TestimonialFormData {
  title: string;
  video_file_path: string;
  video_file_size: number;
  redirect_url: string;
  enable_redirect: boolean;
  is_active: boolean;
}

export const useTestimonialManager = () => {
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVideo, setNewVideo] = useState<TestimonialFormData>({
    title: '',
    video_file_path: '',
    video_file_size: 0,
    redirect_url: '',
    enable_redirect: false,
    is_active: true
  });
  const { toast } = useToast();

  const loadVideos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('testimonial_videos')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading testimonial videos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos témoignages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const updateFormData = useCallback((updates: Partial<TestimonialFormData>) => {
    setNewVideo(prev => ({ ...prev, ...updates }));
  }, []);

  const handleVideoUpload = useCallback((videoPath: string, fileSize: number) => {
    console.log('Video uploaded successfully:', { videoPath, fileSize });
    updateFormData({ video_file_path: videoPath, video_file_size: fileSize });
  }, [updateFormData]);

  const removeUploadedVideo = useCallback(() => {
    updateFormData({ video_file_path: '', video_file_size: 0 });
  }, [updateFormData]);

  const addVideo = useCallback(async () => {
    if (!newVideo.title || !newVideo.video_file_path) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis et télécharger une vidéo.",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrder = Math.max(...videos.map(v => v.display_order), -1);
      
      const videoData = {
        title: newVideo.title,
        video_url: '',
        platform: 'upload',
        thumbnail_url: null,
        is_active: newVideo.is_active,
        display_order: maxOrder + 1,
        video_file_path: newVideo.video_file_path,
        video_file_size: newVideo.video_file_size,
        redirect_url: newVideo.redirect_url || null,
        enable_redirect: newVideo.enable_redirect
      };

      const { data, error } = await supabase
        .from('testimonial_videos')
        .insert(videoData)
        .select()
        .single();

      if (error) throw error;

      setNewVideo({
        title: '',
        video_file_path: '',
        video_file_size: 0,
        redirect_url: '',
        enable_redirect: false,
        is_active: true
      });

      await loadVideos();
      
      toast({
        title: "Succès",
        description: "Vidéo témoignage ajoutée avec succès.",
      });
    } catch (error: any) {
      console.error('Error adding video:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout de la vidéo: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [newVideo, videos, toast, loadVideos]);

  const deleteVideo = useCallback(async (id: string, videoPath?: string) => {
    try {
      if (videoPath) {
        await supabase.storage
          .from('testimonial-videos')
          .remove([videoPath]);
      }

      const { error } = await supabase
        .from('testimonial_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadVideos();
      toast({
        title: "Succès",
        description: "Vidéo supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression.",
        variant: "destructive",
      });
    }
  }, [toast, loadVideos]);

  const toggleVideoStatus = useCallback(async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonial_videos')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
      loadVideos();
    } catch (error) {
      console.error('Error updating video status:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour.",
        variant: "destructive",
      });
    }
  }, [toast, loadVideos]);

  const toggleRedirect = useCallback(async (id: string, enable_redirect: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonial_videos')
        .update({ enable_redirect })
        .eq('id', id);

      if (error) throw error;
      loadVideos();
    } catch (error) {
      console.error('Error updating redirect setting:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du paramètre de redirection.",
        variant: "destructive",
      });
    }
  }, [toast, loadVideos]);

  return {
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
  };
};
