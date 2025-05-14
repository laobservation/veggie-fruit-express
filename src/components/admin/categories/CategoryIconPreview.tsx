
import React from 'react';

interface CategoryIconPreviewProps {
  name: string;
  imageIcon: string | null;
  bg: string;
}

const CategoryIconPreview: React.FC<CategoryIconPreviewProps> = ({
  name,
  imageIcon,
  bg
}) => {
  return (
    <div className="flex items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bg}`}>
        {imageIcon ? (
          <img 
            src={imageIcon} 
            alt={name} 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              // If image fails to load, fallback to text
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentNode;
              if (parent) {
                const fallbackText = document.createElement('span');
                fallbackText.className = 'text-2xl';
                fallbackText.textContent = name.charAt(0).toUpperCase();
                parent.appendChild(fallbackText);
              }
              console.log("Image failed to load, falling back to text icon");
            }}
          />
        ) : (
          <span className="text-2xl">{name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <span className="ml-3 font-medium">{name || 'Category Name'}</span>
    </div>
  );
};

export default CategoryIconPreview;
