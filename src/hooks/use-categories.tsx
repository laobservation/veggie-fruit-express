
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import { Category } from '@/types/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the database
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await getCategoriesTable()
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Transform data to match our Category interface
      if (data && data.length > 0) {
        const formattedCategories: Category[] = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          image_icon: cat.image_icon,
          background_color: cat.background_color || 'bg-gray-100',
          is_visible: cat.is_visible !== false,
          display_order: cat.display_order || 999,
          created_at: cat.created_at,
          updated_at: cat.updated_at,
          icon: cat.icon,
          meta_title: cat.meta_title,
          meta_description: cat.meta_description,
          meta_keywords: cat.meta_keywords,
          canonical_url: cat.canonical_url,
          robots_directives: cat.robots_directives,
          structured_data: cat.structured_data,
          og_title: cat.og_title,
          og_description: cat.og_description,
          og_image: cat.og_image,
          og_url: cat.og_url,
        }));
        
        setCategories(formattedCategories);
        console.log('Categories fetched:', formattedCategories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription for category changes
  useEffect(() => {
    fetchCategories();
    
    const channel = supabase
      .channel('category-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          console.log('CategoryManager: Detected category change, refreshing...');
          fetchCategories();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    categories,
    loading,
    fetchCategories
  };
};
