
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

export type SupabaseProduct = {
  id: string | number;
  name: string;
  category: 'fruit' | 'vegetable';
  price: number;
  image_url: string;
  description: string;
  unit: string;
  link_to_category?: boolean;
  media_type?: 'image' | 'video';
  created_at?: string;
};

// Transform local product data format to Supabase format
export const transformProductForSupabase = (product: Product): Omit<SupabaseProduct, 'id' | 'created_at'> => {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    image_url: product.image,
    description: product.description,
    unit: product.unit,
    link_to_category: product.categoryLink,
    media_type: product.videoUrl ? 'video' : 'image',
  };
};

// Transform Supabase product format to local format
export const transformProductFromSupabase = (product: SupabaseProduct): Product => {
  return {
    id: String(product.id),
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image_url,
    description: product.description,
    unit: product.unit,
    categoryLink: product.link_to_category,
    videoUrl: product.media_type === 'video' ? product.image_url : undefined,
    featured: false // Default value as it's not stored in Supabase
  };
};

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('Products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data.map(transformProductFromSupabase);
};

// Create a new product in Supabase
export const createProduct = async (product: Product): Promise<Product> => {
  const supabaseProduct = transformProductForSupabase(product);
  
  const { data, error } = await supabase
    .from('Products')
    .insert([supabaseProduct])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  return transformProductFromSupabase(data);
};

// Update an existing product in Supabase
export const updateProduct = async (id: string, product: Product): Promise<Product> => {
  const supabaseProduct = transformProductForSupabase(product);
  
  const { data, error } = await supabase
    .from('Products')
    .update(supabaseProduct)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  
  return transformProductFromSupabase(data);
};

// Delete a product from Supabase
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('Products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
