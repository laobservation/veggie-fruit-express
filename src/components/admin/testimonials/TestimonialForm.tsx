
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import VideoUploader from '../VideoUploader';

interface TestimonialFormData {
  title: string;
  video_file_path: string;
  video_file_size: number;
  redirect_url: string;
  enable_redirect: boolean;
  is_active: boolean;
}

interface TestimonialFormProps {
  formData: TestimonialFormData;
  onFormChange: (data: Partial<TestimonialFormData>) => void;
  onVideoUploaded: (videoPath: string, fileSize: number) => void;
  onRemoveVideo: () => void;
  onSubmit: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  formData,
  onFormChange,
  onVideoUploaded,
  onRemoveVideo,
  onSubmit
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFormChange({ title: e.target.value })}
          placeholder="Titre de la vidéo"
        />
      </div>

      <VideoUploader
        onVideoUploaded={onVideoUploaded}
        currentVideoPath={formData.video_file_path}
        onRemove={onRemoveVideo}
      />
      
      <div>
        <Label htmlFor="redirect_url">URL de redirection (optionnel)</Label>
        <Input
          id="redirect_url"
          value={formData.redirect_url}
          onChange={(e) => onFormChange({ redirect_url: e.target.value })}
          placeholder="https://instagram.com/p/..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.enable_redirect}
          onCheckedChange={(checked) => onFormChange({ enable_redirect: checked })}
        />
        <Label>Activer la redirection vers l'URL officielle</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => onFormChange({ is_active: checked })}
        />
        <Label>Activer cette vidéo</Label>
      </div>

      <Button onClick={onSubmit} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter la vidéo
      </Button>
    </div>
  );
};

export default TestimonialForm;
