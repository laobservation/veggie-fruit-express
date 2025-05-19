
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2, Instagram, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InstagramPost {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  createdAt: string;
}

const InstagramManager = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Form state
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load Instagram posts
  useEffect(() => {
    loadPosts();
  }, []);
  
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading Instagram posts:', error);
      toast({
        title: "Error loading Instagram posts",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add new post
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
      setIsAddDialogOpen(false);
      
      // Reload posts
      loadPosts();
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
  
  // Delete post
  const handleDeletePost = async () => {
    if (!selectedPostId) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', selectedPostId);
        
      if (error) throw error;
      
      toast({
        title: "Instagram post deleted",
        description: "Your post has been deleted successfully",
        variant: "default",
      });
      
      // Reset state and close dialog
      setSelectedPostId(null);
      setIsDeleteDialogOpen(false);
      
      // Reload posts
      loadPosts();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Instagram Feed</h2>
          <p className="text-gray-500">Manage your Instagram feed on your homepage</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Post</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
          <Instagram size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Instagram Posts Yet</h3>
          <p className="text-gray-500 text-center mb-4">Add your first Instagram post to display on your homepage</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Post</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {post.videoUrl.includes('.mp4') || post.videoUrl.includes('.mov') ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video size={48} className="text-white/80" />
                  </div>
                ) : null}
                <img 
                  src={post.thumbnailUrl} 
                  alt={post.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm line-clamp-3">{post.caption}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="ghost" size="sm" asChild>
                  <a href={post.videoUrl} target="_blank" rel="noopener noreferrer">View</a>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Post Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddPost} disabled={isSubmitting || !videoUrl || !caption}>
              {isSubmitting ? "Adding..." : "Add Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Instagram Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstagramManager;
