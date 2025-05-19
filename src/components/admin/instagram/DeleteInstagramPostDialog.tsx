
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteInstagramPostDialogProps {
  postId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteInstagramPostDialog: React.FC<DeleteInstagramPostDialogProps> = ({ 
  postId, 
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDeletePost = async () => {
    if (!postId) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', postId);
        
      if (error) throw error;
      
      toast({
        title: "Instagram post deleted",
        description: "Your post has been deleted successfully",
        variant: "default",
      });
      
      onClose();
      onSuccess();
      
    } catch (error) {
      console.error('Error deleting Instagram post:', error);
      toast({
        title: "Error deleting post",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>Delete Instagram Post</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this post? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeletePost} disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete Post"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteInstagramPostDialog;
