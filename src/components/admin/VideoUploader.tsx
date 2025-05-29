
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoUploaderProps {
  onVideoUploaded: (videoPath: string, fileSize: number) => void;
  currentVideoPath?: string;
  onRemove?: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoUploaded,
  currentVideoPath,
  onRemove
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez télécharger un fichier MP4, WebM, MOV ou AVI.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Check if bucket exists and is accessible
      console.log('Checking bucket access...');
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('Bucket access error:', bucketError);
        throw new Error('Impossible d\'accéder au stockage');
      }

      const akhdarmediaBucket = buckets?.find(bucket => bucket.name === 'akhdarmedia');
      if (!akhdarmediaBucket) {
        throw new Error('Le bucket akhdarmedia n\'existe pas');
      }

      console.log('Bucket found:', akhdarmediaBucket);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      console.log('Uploading file:', filePath);
      console.log('File size:', file.size);
      console.log('File type:', file.type);

      const { data, error: uploadError } = await supabase.storage
        .from('akhdarmedia')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // More specific error handling
        if (uploadError.message.includes('row-level security')) {
          throw new Error('Problème de sécurité - veuillez vérifier les permissions du bucket');
        } else if (uploadError.message.includes('not found')) {
          throw new Error('Bucket non trouvé - veuillez vérifier la configuration');
        } else {
          throw new Error(uploadError.message || 'Erreur lors du téléchargement');
        }
      }

      console.log('Upload successful:', data);

      // Verify the file was uploaded by trying to get its public URL
      const { data: urlData } = supabase.storage
        .from('akhdarmedia')
        .getPublicUrl(filePath);

      console.log('File public URL:', urlData.publicUrl);

      onVideoUploaded(filePath, file.size);
      
      toast({
        title: "Succès",
        description: "Vidéo téléchargée avec succès.",
      });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Erreur",
        description: error.message || 'Erreur inconnue lors du téléchargement',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Vidéo témoignage</Label>
      
      {currentVideoPath ? (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Vidéo téléchargée</p>
              <p className="text-xs text-gray-500">{currentVideoPath}</p>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRemove}
              >
                <X className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Glissez-déposez votre vidéo ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500 mb-4">
            MP4, WebM, MOV ou AVI - Max 50MB
          </p>
          
          <Input
            type="file"
            accept="video/mp4,video/webm,video/mov,video/avi"
            onChange={handleInputChange}
            disabled={uploading}
            className="hidden"
            id="video-upload"
          />
          
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            {uploading ? 'Téléchargement...' : 'Sélectionner une vidéo'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
