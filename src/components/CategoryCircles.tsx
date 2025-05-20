
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  imageIcon?: string | null;
  bg: string;
  path: string;
  isVisible?: boolean;
  displayOrder?: number;
}

const CategoryCircles: React.FC = () => {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default fallback categories
  const defaultCategories = [
    { 
      id: 'fruits', 
      name: 'Fruits', 
      imageIcon: '/lovable-uploads/7eb3dccd-9b4a-4f2b-afbe-ca6658b17929.png', 
      bg: 'bg-red-500', 
      path: '/category/fruits' 
    },
    { 
      id: 'vegetables', 
      name: 'Légumes', 
      imageIcon: '/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png', 
      bg: 'bg-green-500', 
      path: '/category/vegetables' 
    },
    { 
      id: 'packs', 
      name: 'Packs', 
      imageIcon: '/lovable-uploads/3e6664d5-ad8b-4a42-8cd9-a740bb96dcd4.png',
      bg: 'bg-amber-500', 
      path: '/category/packs' 
    },
    { 
      id: 'drinks', 
      name: 'Boissons', 
      imageIcon: '/lovable-uploads/6f3cacf5-5377-47c9-8cba-3837c17f4d36.png', 
      bg: 'bg-blue-500', 
      path: '/category/drinks' 
    },
  ];
  
  useEffect(() => {
    fetchCategories();
    
    // Set up a subscription to listen for category changes
    const categoriesChannel = supabase
      .channel('categories-circle-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          console.log('CategoryCircles: Detected category change, refreshing...');
          fetchCategories();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await getCategoriesTable()
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform to match our Category interface and only include visible categories
        const formattedCategories: Category[] = data
          .filter(cat => cat.is_visible !== false)
          .map(cat => {
            // Convert bg-gray-100 to bg-gray-500 for better visibility in circles
            const bgColor = cat.background_color?.replace('-100', '-500') || 'bg-gray-500';
            
            return {
              id: cat.id,
              name: cat.name,
              imageIcon: cat.image_icon || null,
              bg: bgColor,
              path: `/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
              isVisible: cat.is_visible !== false,
              displayOrder: cat.display_order || 999
            };
          });
        
        setCategories(formattedCategories);
      } else {
        // Use default categories if none found in DB
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center animate-pulse min-w-[80px]">
              <div className="bg-gray-200 w-16 h-16 rounded-full mb-2"></div>
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
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
                  category.bg
                )}>
                  {category.imageIcon ? (
                    <img 
                      src={category.imageIcon} 
                      alt={category.name} 
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentNode;
                        if (parent instanceof HTMLElement) {
                          parent.innerHTML = `<span class="text-3xl text-white">${category.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-3xl text-white">{category.name.charAt(0)}</span>
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
