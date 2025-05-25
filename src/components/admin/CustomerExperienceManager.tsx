
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, Plus } from 'lucide-react';

interface CustomerVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  platform: 'instagram' | 'tiktok' | 'facebook';
  created_at: string;
}

const CustomerExperienceManager: React.FC = () => {
  const [videos, setVideos] = useState<CustomerVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CustomerVideo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    thumbnail_url: '',
    platform: 'instagram' as 'instagram' | 'tiktok' | 'facebook'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      // Use type assertion since the table isn't in the generated types yet
      const { data, error } = await (supabase as any)
        .from('customer_videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVideo) {
        const { error } = await (supabase as any)
          .from('customer_videos')
          .update(formData)
          .eq('id', editingVideo.id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Vidéo mise à jour avec succès"
        });
      } else {
        const { error } = await (supabase as any)
          .from('customer_videos')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Vidéo ajoutée avec succès"
        });
      }
      
      setIsDialogOpen(false);
      setEditingVideo(null);
      setFormData({
        title: '',
        video_url: '',
        thumbnail_url: '',
        platform: 'instagram'
      });
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (video: CustomerVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      platform: video.platform
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;
    
    try {
      const { error } = await (supabase as any)
        .from('customer_videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Vidéo supprimée avec succès"
      });
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  const openAddDialog = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      video_url: '',
      thumbnail_url: '',
      platform: 'instagram'
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expérience Client - Vidéos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une vidéo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="video_url">URL de la vidéo</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="thumbnail_url">URL de l'image de couverture (optionnel)</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="platform">Plateforme</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value: 'instagram' | 'tiktok' | 'facebook') => 
                    setFormData({ ...formData, platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingVideo ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm">{video.title}</CardTitle>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(video.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {video.thumbnail_url && (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <p className="text-xs text-gray-500 mb-1">Plateforme: {video.platform}</p>
              <a 
                href={video.video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Voir la vidéo
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {videos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune vidéo ajoutée pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default CustomerExperienceManager;
