
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddInstagramPostFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddInstagramPostForm: React.FC<AddInstagramPostFormProps> = ({ onClose, onSuccess }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddPost = async () => {
    if (!videoUrl || !caption) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Use thumbnail if provided, otherwise use a default or extract from video URL
      const finalThumbnailUrl = thumbnailUrl || videoUrl.replace(/\.(mp4|mov)$/, '.jpg');
      
      const { data, error } = await supabase
        .from('instagram_posts')
        .insert([
          {
            video_url: videoUrl,
            thumbnail_url: finalThumbnailUrl,
            caption: caption,
          },
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Instagram post added",
        description: "Your post has been added successfully",
        variant: "default",
      });
      
      // Reset form and close dialog
      setVideoUrl('');
      setThumbnailUrl('');
      setCaption('');
      onClose();
      onSuccess();
      
    } catch (error) {
      console.error('Error adding Instagram post:', error);
      toast({
        title: "Error adding post",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add Instagram Post</DialogTitle>
        <DialogDescription>
          Add a new Instagram post to your homepage feed
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div>
          <Label htmlFor="videoUrl">Video URL <span className="text-red-500">*</span></Label>
          <Input
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
          />
          <p className="text-xs text-gray-500 mt-1">Direct link to MP4 or MOV file</p>
        </div>
        
        <div>
          <Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label>
          <Input
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Optional preview image for video</p>
        </div>
        
        <div>
          <Label htmlFor="caption">Caption <span className="text-red-500">*</span></Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption for your post"
            className="h-20"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleAddPost} disabled={isSubmitting || !videoUrl || !caption}>
          {isSubmitting ? "Adding..." : "Add Post"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddInstagramPostForm;
