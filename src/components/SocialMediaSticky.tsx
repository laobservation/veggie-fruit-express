
import React, { useState } from 'react';
import { Facebook, Instagram, X } from 'lucide-react';

const SocialMediaSticky = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white rounded-lg shadow-lg p-2 border">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsVisible(false)}
          className="self-end p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close social media panel"
        >
          <X className="h-3 w-3 text-gray-500" />
        </button>
        
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          style={{
            background: 'linear-gradient(145deg, #1877f2, #166fe5)',
            boxShadow: '0 4px 15px rgba(24, 119, 242, 0.4)',
          }}
          aria-label="Visit our Facebook page"
        >
          <Facebook className="h-4 w-4" />
        </a>
        
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          style={{
            background: 'linear-gradient(145deg, #e4405f, #d62976, #962fbf, #4f5bd5)',
            boxShadow: '0 4px 15px rgba(228, 64, 95, 0.4)',
          }}
          aria-label="Visit our Instagram page"
        >
          <Instagram className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default SocialMediaSticky;
