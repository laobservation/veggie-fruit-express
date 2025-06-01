
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2, GripVertical, ExternalLink } from 'lucide-react';

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

interface TestimonialListItemProps {
  video: TestimonialVideo;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onToggleRedirect: (id: string, enableRedirect: boolean) => void;
  onDelete: (id: string, videoPath?: string) => void;
}

const TestimonialListItem: React.FC<TestimonialListItemProps> = ({
  video,
  onToggleStatus,
  onToggleRedirect,
  onDelete
}) => {
  return (
    <div className="border rounded-lg p-4">
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
                onCheckedChange={(checked) => onToggleStatus(video.id, checked)}
              />
              <span className="text-xs">Actif</span>
            </div>
            {video.redirect_url && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={video.enable_redirect || false}
                  onCheckedChange={(checked) => onToggleRedirect(video.id, checked)}
                />
                <span className="text-xs">Redirection</span>
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(video.id, video.video_file_path || undefined)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialListItem;
