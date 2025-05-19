
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Video } from 'lucide-react';

interface InstagramPost {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string;
  createdAt?: string;
}

interface InstagramPostCardProps {
  post: InstagramPost;
  onDeleteClick: (postId: string) => void;
}

const InstagramPostCard: React.FC<InstagramPostCardProps> = ({ post, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        {post.videoUrl.includes('.mp4') || post.videoUrl.includes('.mov') ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video size={48} className="text-white/80" />
          </div>
        ) : null}
        <img 
          src={post.thumbnailUrl || undefined} 
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
          onClick={() => onDeleteClick(post.id)}
        >
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstagramPostCard;
