
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

// Update the type definition to match Supabase's actual structure
export type SupabaseProduct = {
  id: number;
  name: string | null;
  category: string | null;  // Changed from 'fruit' | 'vegetable' to string | null to match Supabase
  price: number | null;
  image_url: string | null;
  description: string | null;
  unit: string | null;
  link_to_category: boolean | null;
  media_type: string | null;  // Changed from 'image' | 'video' to string | null
  created_at: string | null;
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
  if (!product.name || !product.category || !product.price || !product.image_url || 
      !product.description || !product.unit) {
    throw new Error('Invalid product data from database');
  }
  
  return {
    id: String(product.id),
    name: product.name,
    category: product.category as 'fruit' | 'vegetable', // Type assertion to match Product type
    price: product.price,
    image: product.image_url,
    description: product.description,
    unit: product.unit,
    categoryLink: product.link_to_category || false,
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
  
  // Use type assertion to handle the response from Supabase
  return (data as SupabaseProduct[]).map(transformProductFromSupabase);
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
  
  return transformProductFromSupabase(data as SupabaseProduct);
};

// Update an existing product in Supabase
export const updateProduct = async (id: string, product: Product): Promise<Product> => {
  const supabaseProduct = transformProductForSupabase(product);
  
  const { data, error } = await supabase
    .from('Products')
    .update(supabaseProduct)
    .eq('id', parseInt(id, 10)) // Convert string id to number
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  
  return transformProductFromSupabase(data as SupabaseProduct);
};

// Delete a product from Supabase
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('Products')
    .delete()
    .eq('id', parseInt(id, 10)); // Convert string id to number
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
