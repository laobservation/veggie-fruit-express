
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export const CategoryNavigation: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback categories
  const defaultCategories = [{
    id: 'fruits',
    name: 'Fruits',
    imageIcon: '/lovable-uploads/7eb3dccd-9b4a-4f2b-afbe-ca6658b17929.png',
    bg: 'bg-red-100',
    path: '/category/fruits',
    isVisible: true,
    displayOrder: 1
  }, {
    id: 'vegetables',
    name: 'Légumes',
    imageIcon: '/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png',
    bg: 'bg-green-100',
    path: '/category/légumes',
    isVisible: true,
    displayOrder: 2
  }, {
    id: 'packs',
    name: 'Packs',
    imageIcon: '/lovable-uploads/3e6664d5-ad8b-4a42-8cd9-a740bb96dcd4.png',
    bg: 'bg-amber-100',
    path: '/category/packs',
    isVisible: true,
    displayOrder: 3
  }, {
    id: 'drinks',
    name: 'Boissons',
    imageIcon: '/lovable-uploads/6f3cacf5-5377-47c9-8cba-3837c17f4d36.png',
    bg: 'bg-blue-100',
    path: '/category/drinks',
    isVisible: true,
    displayOrder: 4
  }];

  useEffect(() => {
    fetchCategories();

    // Set up a subscription to listen for category changes
    const categoriesChannel = supabase.channel('categories-circle-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'categories'
    }, () => {
      console.log('CategoryCircles: Detected category change, refreshing...');
      fetchCategories();
    }).subscribe();
    return () => {
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await getCategoriesTable().select('*').order('display_order', {
        ascending: true
      });
      if (error) throw error;
      if (data && data.length > 0) {
        // Transform to match our Category interface
        // FIXED: Show ALL categories regardless of is_visible setting for home display
        const formattedCategories: Category[] = data.map(cat => {
          // Format URL-friendly path - ensure we have consistent plural forms for URLs
          let pathName = cat.name.toLowerCase().replace(/\s+/g, '-');

          // Special handling for certain categories to maintain consistent URL structure
          if (pathName === 'fruit') pathName = 'fruits';
          if (pathName === 'vegetable' || pathName === 'légume') pathName = 'légumes';
          if (pathName === 'pack') pathName = 'packs';
          if (pathName === 'drink') pathName = 'drinks';
          
          return {
            id: cat.id,
            name: cat.name,
            imageIcon: cat.image_icon || null,
            bg: cat.background_color || 'bg-gray-100',
            path: `/category/${pathName}`,
            isVisible: true, // FORCE TRUE to always show category icons under home slider
            displayOrder: cat.display_order || 999
          };
        });
        console.log('Formatted categories:', formattedCategories);
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
    return <div className="grid grid-cols-4 gap-4 w-full pb-2">
        {[1, 2, 3, 4].map(i => <div key={i} className="flex flex-col items-center animate-pulse">
            <div className="bg-gray-200 w-16 h-16 rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-4 w-20 rounded"></div>
          </div>)}
      </div>;
  }

  return <div className="grid grid-cols-4 gap-4 w-full pb-2 my-0 py-px">
      {categories.map(category => <Link to={category.path} key={category.id} className="flex flex-col items-center">
          <div className={`${category.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-2`}>
            {category.imageIcon ? <img src={category.imageIcon} alt={category.name} className="w-10 h-10 object-contain" onError={e => {
          console.error("Image failed to load:", category.imageIcon);
          (e.target as HTMLImageElement).style.display = 'none';
          const parent = (e.target as HTMLImageElement).parentNode;
          if (parent instanceof HTMLElement) {
            parent.innerHTML = `<span class="text-3xl">${category.name.charAt(0)}</span>`;
          }
        }} /> : <span className="text-3xl">{category.name.charAt(0)}</span>}
          </div>
          <p className="text-sm text-center text-gray-700 font-bold">{category.name}</p>
        </Link>)}
    </div>;
};

export default CategoryNavigation;
