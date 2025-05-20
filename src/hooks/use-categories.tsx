
import { useState, useEffect } from 'react';
import { supabase, getCategoriesTable } from '@/integrations/supabase/client';
import { Category } from '@/types/category';
import { toast } from '@/hooks/use-toast';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  fetchCategories: () => Promise<void>;
}

export function useCategories(): CategoriesState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to map database fields to category interface
  const mapDbToCategory = (item: any): Category => ({
    id: item.id,
    name: item.name,
    imageIcon: item.image_icon,
    bg: item.background_color || 'bg-gray-100',
    isVisible: item.is_visible !== undefined ? item.is_visible : true,
    displayOrder: item.display_order !== undefined ? item.display_order : 999
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data: categoriesData, error } = await getCategoriesTable()
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      const mappedCategories = categoriesData.map(mapDbToCategory);
      setCategories(mappedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Set up real-time subscription for category changes
    const categoriesSubscription = supabase
      .channel('public:categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
        },
        () => {
          console.log('Categories changed, refreshing data');
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesSubscription);
    };
  }, []);

  return { categories, loading, error, fetchCategories };
}
