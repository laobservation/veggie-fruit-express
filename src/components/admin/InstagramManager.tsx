
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { useInstagramPosts } from '@/hooks/use-instagram-posts';
import InstagramPostCard from './instagram/InstagramPostCard';
import AddInstagramPostForm from './instagram/AddInstagramPostForm';
import DeleteInstagramPostDialog from './instagram/DeleteInstagramPostDialog';
import EmptyInstagramState from './instagram/EmptyInstagramState';

const InstagramManager = () => {
  const { posts, isLoading, refreshPosts } = useInstagramPosts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsDeleteDialogOpen(true);
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
        <EmptyInstagramState onAddClick={() => setIsAddDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <InstagramPostCard 
              key={post.id} 
              post={post} 
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}
      
      {/* Add Post Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddInstagramPostForm 
          onClose={() => setIsAddDialogOpen(false)} 
          onSuccess={refreshPosts} 
        />
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteInstagramPostDialog 
          postId={selectedPostId} 
          onClose={() => setIsDeleteDialogOpen(false)} 
          onSuccess={refreshPosts} 
        />
      </Dialog>
    </div>
  );
};

export default InstagramManager;
