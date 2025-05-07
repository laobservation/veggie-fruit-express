
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  icon?: string;
  imageIcon?: string;
  bg: string;
  path: string;
}

export const CategoryNavigation: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default fallback categories if none are found in DB
  const defaultCategories = [
    { id: 'fruits', name: 'Fruits', icon: '🍎', bg: 'bg-red-100', path: '/category/fruits' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', bg: 'bg-green-100', path: '/category/vegetables' },
    { 
      id: 'packs', 
      name: 'Packs', 
      imageIcon: '/lovable-uploads/3e6664d5-ad8b-4a42-8cd9-a740bb96dcd4.png', 
      bg: 'bg-amber-100', 
      path: '/category/packs' 
    },
    { id: 'drinks', name: 'Drinks', icon: '🥤', bg: 'bg-blue-100', path: '/category/drinks' },
  ];

  useEffect(() => {
    fetchCategories();
    
    // Set up a subscription to listen for category changes
    const categoriesChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
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
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform to match our Category interface
        const formattedCategories: Category[] = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '📦',
          imageIcon: cat.image_icon,
          bg: cat.background_color || 'bg-gray-100',
          path: `/category/${cat.name.toLowerCase()}`
        }));
        
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
      <div className="grid grid-cols-4 gap-4 w-full pb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col items-center animate-pulse">
            <div className="bg-gray-200 w-16 h-16 rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-4 w-20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-4 gap-4 w-full pb-2">
      {categories.map((category) => (
        <Link
          to={category.path}
          key={category.id}
          className="flex flex-col items-center"
        >
          <div className={`${category.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-2`}>
            {category.imageIcon ? (
              <img src={category.imageIcon} alt={category.name} className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-3xl">{category.icon}</span>
            )}
          </div>
          <p className="text-sm text-center text-gray-700">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryNavigation;
