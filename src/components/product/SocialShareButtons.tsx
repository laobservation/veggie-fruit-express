
import React from 'react';
import { Share } from 'lucide-react';
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
  
  // Create a simplified sharing data object with just title and URL
  const shareData = {
    title: product.name,
    url: productUrl
  };
  
  // WhatsApp sharing URL - only include product title and link, no description
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title} ${productUrl}`)}`;
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      // Fallback - open WhatsApp directly
      openShareLink(whatsappUrl);
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
          onClick={() => openShareLink(whatsappUrl)}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="h-4 w-4 text-green-600 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M20.636 3.365C18.366 1.194 15.357 0 12.228 0 5.541 0 .14 5.291.14 11.818c0 2.08.568 4.113 1.645 5.893L.086 24l6.448-1.562c1.775.96 3.778 1.47 5.823 1.47 6.379 0 11.551-4.949 11.551-11.023 0-3.082-1.271-5.985-3.272-8.15z" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
          <span>WhatsApp</span>
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
