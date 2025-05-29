
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, GripVertical, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoUploader from './VideoUploader';

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

const TestimonialManager = () => {
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVideo, setNewVideo] = useState({
    title: '',
    video_file_path: '',
    video_file_size: 0,
    redirect_url: '',
    enable_redirect: false,
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
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
  };

  const handleVideoUpload = (videoPath: string, fileSize: number) => {
    setNewVideo(prev => ({
      ...prev,
      video_file_path: videoPath,
      video_file_size: fileSize
    }));
  };

  const removeUploadedVideo = () => {
    setNewVideo(prev => ({
      ...prev,
      video_file_path: '',
      video_file_size: 0
    }));
  };

  const addVideo = async () => {
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
      
      const { error } = await supabase
        .from('testimonial_videos')
        .insert({
          title: newVideo.title,
          video_url: '', // Not used for uploaded videos
          platform: 'upload', // Mark as uploaded video
          thumbnail_url: null,
          is_active: newVideo.is_active,
          display_order: maxOrder + 1,
          video_file_path: newVideo.video_file_path,
          video_file_size: newVideo.video_file_size,
          redirect_url: newVideo.redirect_url || null,
          enable_redirect: newVideo.enable_redirect
        });

      if (error) throw error;

      setNewVideo({
        title: '',
        video_file_path: '',
        video_file_size: 0,
        redirect_url: '',
        enable_redirect: false,
        is_active: true
      });

      loadVideos();
      toast({
        title: "Succès",
        description: "Vidéo témoignage ajoutée avec succès.",
      });
    } catch (error) {
      console.error('Error adding video:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la vidéo.",
        variant: "destructive",
      });
    }
  };

  const deleteVideo = async (id: string, videoPath?: string) => {
    try {
      // Delete from storage if it's an uploaded video
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
  };

  const toggleVideoStatus = async (id: string, is_active: boolean) => {
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
  };

  const toggleRedirect = async (id: string, enable_redirect: boolean) => {
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
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle vidéo témoignage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={newVideo.title}
              onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la vidéo"
            />
          </div>

          <VideoUploader
            onVideoUploaded={handleVideoUpload}
            currentVideoPath={newVideo.video_file_path}
            onRemove={removeUploadedVideo}
          />
          
          <div>
            <Label htmlFor="redirect_url">URL de redirection (optionnel)</Label>
            <Input
              id="redirect_url"
              value={newVideo.redirect_url}
              onChange={(e) => setNewVideo(prev => ({ ...prev, redirect_url: e.target.value }))}
              placeholder="https://instagram.com/p/..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={newVideo.enable_redirect}
              onCheckedChange={(checked) => setNewVideo(prev => ({ ...prev, enable_redirect: checked }))}
            />
            <Label>Activer la redirection vers l'URL officielle</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={newVideo.is_active}
              onCheckedChange={(checked) => setNewVideo(prev => ({ ...prev, is_active: checked }))}
            />
            <Label>Activer cette vidéo</Label>
          </div>

          <Button onClick={addVideo} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la vidéo
          </Button>
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
                <div key={video.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4 flex-1">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-gray-500">
                          {video.platform === 'upload' ? 'Vidéo téléchargée' : video.platform}
                        </p>
                        {video.video_file_path && (
                          <p className="text-xs text-gray-400">{video.video_file_path}</p>
                        )}
                        {video.redirect_url && (
                          <p className="text-xs text-blue-600 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {video.redirect_url}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={video.is_active}
                            onCheckedChange={(checked) => toggleVideoStatus(video.id, checked)}
                          />
                          <span className="text-xs">Actif</span>
                        </div>
                        {video.redirect_url && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={video.enable_redirect || false}
                              onCheckedChange={(checked) => toggleRedirect(video.id, checked)}
                            />
                            <span className="text-xs">Redirection</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteVideo(video.id, video.video_file_path || undefined)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialManager;
