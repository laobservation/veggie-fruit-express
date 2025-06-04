
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('link_to_category', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Transform Supabase data to match Product interface
    const transformedProducts: Product[] = (data || []).map(item => ({
      id: String(item.id),
      name: item.name || '',
      category: mapCategory(item.category),
      price: item.price || 0,
      image: item.image_url || '',
      description: item.description || '',
      unit: item.unit || 'kg',
      featured: true,
      videoUrl: item.media_type === 'video' ? item.image_url : undefined,
      categoryLink: item.link_to_category || false,
      stock: item.stock || 0,
      additionalImages: item.additional_images || []
    }));

    return transformedProducts;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};

// Helper function to map database category to Product category type
const mapCategory = (dbCategory: string | null): 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus' => {
  if (!dbCategory) return 'vegetable';
  
  const category = dbCategory.toLowerCase();
  
  if (category.includes('fruit')) return 'fruit';
  if (category.includes('légume') || category.includes('vegetable')) return 'vegetable';
  if (category.includes('pack')) return 'pack';
  if (category.includes('boisson') || category.includes('drink')) return 'drink';
  if (category.includes('salade') || category.includes('jus')) return 'salade-jus';
  
  return 'vegetable'; // default fallback
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return [];
  }
};
