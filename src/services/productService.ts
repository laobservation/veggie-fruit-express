
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

// Update the type definition to match Supabase's actual structure
export type SupabaseProduct = {
  id: number;
  name: string | null;
  category: string | null;  
  price: number | null;
  image_url: string | null;
  description: string | null;
  unit: string | null;
  link_to_category: boolean | null;
  media_type: string | null;  
  created_at: string | null;
  stock: number | null;  
};

// Extended Product interface with optional stock
export interface ExtendedProduct extends Product {
  stock?: number;
}

// Transform local product data format to Supabase format
export const transformProductForSupabase = (product: ExtendedProduct): Omit<SupabaseProduct, 'id' | 'created_at'> => {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    image_url: product.image,
    description: product.description,
    unit: product.unit,
    link_to_category: product.categoryLink,
    media_type: product.videoUrl ? 'video' : 'image',
    stock: product.stock || 0,  
  };
};

// Transform Supabase product format to local format
export const transformProductFromSupabase = (product: SupabaseProduct): ExtendedProduct => {
  if (!product.name || !product.category || !product.price || !product.image_url || 
      !product.description || !product.unit) {
    throw new Error('Invalid product data from database');
  }
  
  return {
    id: String(product.id),
    name: product.name,
    category: product.category as 'fruit' | 'vegetable',
    price: product.price,
    image: product.image_url,
    description: product.description,
    unit: product.unit,
    categoryLink: product.link_to_category || false,
    videoUrl: product.media_type === 'video' ? product.image_url : undefined,
    featured: false,
    stock: product.stock || 0,
  };
};

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<ExtendedProduct[]> => {
  const { data, error } = await supabase
    .from('Products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return (data as SupabaseProduct[]).map(transformProductFromSupabase);
};

// Create a new product in Supabase
export const createProduct = async (product: ExtendedProduct): Promise<ExtendedProduct> => {
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
export const updateProduct = async (id: string, product: ExtendedProduct): Promise<ExtendedProduct> => {
  const supabaseProduct = transformProductForSupabase(product);
  
  const { data, error } = await supabase
    .from('Products')
    .update(supabaseProduct)
    .eq('id', parseInt(id, 10))
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
    .eq('id', parseInt(id, 10));
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
