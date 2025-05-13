
import React from 'react';

interface CategoryIconPreviewProps {
  name: string;
  icon?: string | null;
  imageIcon?: string | null;
  bg: string;
}

const CategoryIconPreview: React.FC<CategoryIconPreviewProps> = ({
  name,
  icon,
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
              // If image fails to load, fallback to icon or text
              (e.target as HTMLImageElement).style.display = 'none';
              console.log("Image failed to load");
            }}
          />
        ) : (
          <span className="text-2xl">{icon || name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <span className="ml-3 font-medium">{name || 'Category Name'}</span>
    </div>
  );
};

export default CategoryIconPreview;
