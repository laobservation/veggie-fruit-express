
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Play, ExternalLink } from 'lucide-react';

interface CustomerVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  platform: 'instagram' | 'tiktok' | 'facebook';
  created_at: string;
}

const CustomerExperienceSection: React.FC = () => {
  const [videos, setVideos] = useState<CustomerVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerVideos();
  }, []);

  const fetchCustomerVideos = async () => {
    try {
      // Use type assertion since the table isn't in the generated types yet
      const { data, error } = await (supabase as any)
        .from('customer_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      if (data) {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching customer videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      case 'facebook':
        return '👥';
      default:
        return '📹';
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Expérience Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Expérience Client</h2>
        <p className="text-center text-gray-600 mb-8">Découvrez ce que nos clients disent de nous</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {video.thumbnail_url ? (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Play className="h-12 w-12 text-green-600" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                  <span className="text-lg">{getPlatformIcon(video.platform)}</span>
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <a 
                    href={video.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir la vidéo
                  </a>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{video.platform}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerExperienceSection;
