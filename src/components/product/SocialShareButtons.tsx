
import React from 'react';
import { Share, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface SocialShareButtonsProps {
  product: Product;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ product }) => {
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/product/${product.id}`;
  
  const shareData = {
    title: product.name,
    text: product.description?.substring(0, 100) || `Check out this ${product.name}!`,
    url: productUrl
  };
  
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(productUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      // Fallback - open dropdown
      console.log('Native sharing not supported');
    }
  };
  
  const openShareLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Share product"
          className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center transition-all hover:bg-gray-200"
        >
          <Share className="h-5 w-5 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 min-w-[150px]">
        <DropdownMenuItem 
          className="cursor-pointer flex items-center gap-2 p-2"
          onClick={() => openShareLink(socialLinks.facebook)}
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer flex items-center gap-2 p-2"
          onClick={() => openShareLink(socialLinks.twitter)}
        >
          <Twitter className="h-4 w-4 text-blue-400" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer flex items-center gap-2 p-2"
          onClick={() => openShareLink(socialLinks.linkedin)}
        >
          <Linkedin className="h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2 p-2"
            onClick={handleNativeShare}
          >
            <Share className="h-4 w-4 text-gray-600" />
            <span>Share...</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShareButtons;
