
import React from 'react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Youtube, Plus, X } from 'lucide-react';
import MediaPreview from '../MediaPreview';

interface MediaSelectorProps {
  mediaType: 'image' | 'video';
  setMediaType: (type: 'image' | 'video') => void;
  imageUrl: string;
  videoUrl?: string;
  additionalImages?: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddAdditionalImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
  additionalImageUrl: string;
  setAdditionalImageUrl: (url: string) => void;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  mediaType,
  setMediaType,
  imageUrl,
  videoUrl,
  additionalImages,
  onImageChange,
  onVideoChange,
  onAddAdditionalImage,
  onRemoveAdditionalImage,
  additionalImageUrl,
  setAdditionalImageUrl
}) => {
  return (
    <div className="grid gap-2">
      <Label>Type de média</Label>
      <Tabs 
        value={mediaType} 
        onValueChange={(value) => setMediaType(value as 'image' | 'video')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Image
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            Vidéo YouTube
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="pt-4">
          <div className="grid gap-2">
            <Label htmlFor="image">URL de l'Image Principale</Label>
            <Input 
              id="image" 
              name="image" 
              value={imageUrl} 
              onChange={onImageChange} 
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Additional Images Section */}
          <div className="mt-4">
            <Label htmlFor="additionalImages">Images Additionnelles</Label>
            
            {/* Display added images */}
            {additionalImages && additionalImages.length > 0 && (
              <div className="mt-2 space-y-2">
                {additionalImages.map((img, index) => (
                  <div key={index} className="flex items-center justify-between rounded border p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded overflow-hidden mr-2">
                        <img src={img} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm truncate max-w-[200px]">{img}</span>
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onRemoveAdditionalImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add new image field */}
            <div className="flex items-center gap-2 mt-2">
              <Input 
                value={additionalImageUrl} 
                onChange={(e) => setAdditionalImageUrl(e.target.value)} 
                placeholder="URL de l'image additionnelle"
              />
              <Button 
                type="button" 
                onClick={onAddAdditionalImage} 
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="pt-4">
          <div className="grid gap-2">
            <Label htmlFor="videoUrl">URL YouTube</Label>
            <Input 
              id="videoUrl" 
              name="videoUrl" 
              value={videoUrl || ''} 
              onChange={onVideoChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500">
              Coller le lien d'une vidéo YouTube (ex: https://www.youtube.com/watch?v=abcdefghijk)
            </p>
          </div>
          
          <div className="grid gap-2 mt-4">
            <Label htmlFor="image">Image de couverture (optionnelle)</Label>
            <Input 
              id="image" 
              name="image" 
              value={imageUrl} 
              onChange={onImageChange}
              placeholder="URL d'une image de couverture"
            />
            <p className="text-xs text-gray-500">
              Si non spécifiée, une miniature de la vidéo sera utilisée
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <MediaPreview 
        mediaType={mediaType} 
        imageUrl={imageUrl} 
        videoUrl={videoUrl}
      />
    </div>
  );
};

export default MediaSelector;
