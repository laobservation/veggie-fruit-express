
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, GripVertical } from 'lucide-react';
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
}

const TestimonialManager = () => {
  const [videos, setVideos] = useState<TestimonialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVideo, setNewVideo] = useState({
    title: '',
    video_url: '',
    platform: 'instagram',
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
        case 'facebook':
          return url;
        default:
          return null;
      }
    } catch {
      return null;
    }
  };

  const generateThumbnail = (url: string, platform: string) => {
    const videoId = extractVideoId(url, platform);
    if (!videoId) return null;

    switch (platform) {
      case 'youtube':
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case 'instagram':
        return null; // Instagram doesn't provide direct thumbnail URLs
      case 'tiktok':
        return null; // TikTok doesn't provide direct thumbnail URLs
      case 'facebook':
        return null; // Facebook doesn't provide direct thumbnail URLs
      default:
        return null;
    }
  };

  const addVideo = async () => {
    if (!newVideo.title || !newVideo.video_url) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const thumbnail_url = generateThumbnail(newVideo.video_url, newVideo.platform);
      const maxOrder = Math.max(...videos.map(v => v.display_order), -1);
      
      const { error } = await supabase
        .from('testimonial_videos')
        .insert({
          title: newVideo.title,
          video_url: newVideo.video_url,
          platform: newVideo.platform,
          thumbnail_url,
          is_active: newVideo.is_active,
          display_order: maxOrder + 1
        });

      if (error) throw error;

      setNewVideo({
        title: '',
        video_url: '',
        platform: 'instagram',
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

  const deleteVideo = async (id: string) => {
    try {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newVideo.title}
                onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la vidéo"
              />
            </div>
            <div>
              <Label htmlFor="platform">Plateforme</Label>
              <Select 
                value={newVideo.platform} 
                onValueChange={(value) => setNewVideo(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="video_url">URL de la vidéo</Label>
            <Input
              id="video_url"
              value={newVideo.video_url}
              onChange={(e) => setNewVideo(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://..."
            />
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
                <div key={video.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{video.platform}</p>
                      <p className="text-xs text-gray-400 break-all max-w-md">{video.video_url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={video.is_active}
                      onCheckedChange={(checked) => toggleVideoStatus(video.id, checked)}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
