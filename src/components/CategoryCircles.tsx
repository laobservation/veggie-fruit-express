
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Apple, Carrot } from 'lucide-react';

// These would ideally be dynamically generated from your categories
const categories = [
  { id: 'fruits', name: 'Fruits', icon: Apple, color: 'bg-red-500', path: '/fruits' },
  { id: 'vegetables', name: 'Légumes', icon: Carrot, color: 'bg-green-500', path: '/vegetables' },
  { 
    id: 'packs', 
    name: 'Packs', 
    imageIcon: '/lovable-uploads/3e6664d5-ad8b-4a42-8cd9-a740bb96dcd4.png',
    color: 'bg-amber-500', 
    path: '/' 
  },
  // Add more categories as needed
];

const CategoryCircles: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="relative">
        <div className="overflow-x-auto scrollbar-none pb-2">
          <div className="flex space-x-4 min-w-max">
            {categories.map((category) => (
              <Link
                to={category.path}
                key={category.id}
                className="flex flex-col items-center transition-transform hover:scale-105 duration-200"
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full w-16 h-16 mb-2",
                  category.color
                )}>
                  {category.imageIcon ? (
                    <img 
                      src={category.imageIcon} 
                      alt={category.name} 
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <category.icon className="w-8 h-8 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Fade effect on sides */}
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryCircles;
