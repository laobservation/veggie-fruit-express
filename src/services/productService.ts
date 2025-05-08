
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Json } from "@/integrations/supabase/types";

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
  additional_images: string[] | null;
  // Remove featured from the SupabaseProduct type since it doesn't exist in the DB
};

// Extended Product interface with optional stock
export interface ExtendedProduct extends Product {
  stock?: number;
}

// Transform local product data format to Supabase format
export const transformProductForSupabase = (product: ExtendedProduct): Omit<SupabaseProduct, 'id' | 'created_at'> => {
  // Create a product object without the featured property since it doesn't exist in the database
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    image_url: product.videoUrl && product.videoUrl.trim() !== '' ? product.videoUrl : product.image,
    description: product.description,
    unit: product.unit,
    link_to_category: product.categoryLink || false,
    media_type: product.videoUrl && product.videoUrl.trim() !== '' ? 'video' : 'image',
    stock: product.stock || 0,
    additional_images: product.additionalImages || null
    // Remove featured from here - don't send it to Supabase
  };
};

// Transform Supabase product format to local format
export const transformProductFromSupabase = (product: SupabaseProduct): ExtendedProduct => {
  if (!product) {
    throw new Error('Invalid product data from database');
  }
  
  // Map category from database to local format with broader type support
  let category: 'fruit' | 'vegetable' | 'pack' | 'drink' = 'vegetable';
  
  if (product.category === 'fruit') {
    category = 'fruit';
  } else if (product.category === 'vegetable') {
    category = 'vegetable';
  } else if (product.category === 'pack') {
    category = 'pack';
  } else if (product.category === 'drink') {
    category = 'drink';
  }
  
  return {
    id: String(product.id), // Convert number to string for compatibility
    name: product.name || '',
    category: category, // Force to correct type with expanded options
    price: product.price || 0,
    image: product.image_url || '',
    description: product.description || '',
    unit: product.unit || 'kg',
    categoryLink: product.link_to_category || false,
    videoUrl: product.media_type === 'video' ? product.image_url : undefined,
    featured: true, // Always default to true since it doesn't exist in DB
    stock: product.stock || 0,
    additionalImages: product.additional_images || []
  };
};

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<ExtendedProduct[]> => {
  try {
    console.log('Fetching products from Supabase...');
    const { data, error } = await supabase
      .from('Products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    console.log('Products fetched successfully:', data);
    
    // Transform all products, adding the featured property
    return data.map(transformProductFromSupabase);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Create a new product in Supabase
export const createProduct = async (product: ExtendedProduct): Promise<ExtendedProduct> => {
  try {
    const supabaseProduct = transformProductForSupabase(product);
    console.log('Creating product with data:', supabaseProduct);
    
    const { data, error } = await supabase
      .from('Products')
      .insert([supabaseProduct])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    console.log('Product created successfully:', data);
    return transformProductFromSupabase(data as SupabaseProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product in Supabase
export const updateProduct = async (id: string, product: ExtendedProduct): Promise<ExtendedProduct> => {
  try {
    const supabaseProduct = transformProductForSupabase(product);
    console.log('Updating product with ID:', id, 'Data:', supabaseProduct);
    
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
    
    console.log('Product updated successfully:', data);
    return transformProductFromSupabase(data as SupabaseProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product from Supabase
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log('Deleting product with ID:', id);
    
    const { error } = await supabase
      .from('Products')
      .delete()
      .eq('id', parseInt(id, 10));
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Helper function for HomePage.tsx since it needs to handle product type conversions
export const fixProductImportType = (products: any[]): Product[] => {
  return products.map(product => ({
    ...product,
    id: String(product.id),
    category: product.category as 'fruit' | 'vegetable', // Force type cast for compatibility
    featured: true // Always set featured to true since it doesn't exist in DB
  }));
};
