
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface InstagramPost {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string;
  createdAt?: string;
}

export const useInstagramPosts = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our component interface
      const transformedPosts: InstagramPost[] = (data || []).map((post: any) => ({
        id: post.id,
        videoUrl: post.video_url,
        thumbnailUrl: post.thumbnail_url,
        caption: post.caption,
        createdAt: post.created_at
      }));
      
      setPosts(transformedPosts);
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
  
  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);
  
  return {
    posts,
    isLoading,
    refreshPosts: loadPosts
  };
};
