
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

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
};

// Extended Product interface with optional stock
export interface ExtendedProduct extends Product {
  stock?: number;
}

// Transform local product data format to Supabase format
export const transformProductForSupabase = (product: ExtendedProduct): Omit<SupabaseProduct, 'id' | 'created_at'> => {
  return {
    name: product.name,
    category: product.category, // Use the category directly
    price: product.price,
    image_url: product.videoUrl && product.videoUrl.trim() !== '' ? product.videoUrl : product.image,
    description: product.description,
    unit: product.unit,
    link_to_category: Boolean(product.categoryLink),
    media_type: product.videoUrl && product.videoUrl.trim() !== '' ? 'video' : 'image',
    stock: product.stock || 0,
    additional_images: product.additionalImages || null
  };
};

// Transform Supabase product format to local format
export const transformProductFromSupabase = (product: SupabaseProduct): ExtendedProduct => {
  if (!product) {
    throw new Error('Invalid product data from database');
  }
  
  // Ensure proper category mapping
  const category = product.category as 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus' || 'vegetable';
  
  return {
    id: String(product.id),
    name: product.name || '',
    category: category,
    price: product.price || 0,
    image: product.image_url || '',
    description: product.description || '',
    unit: product.unit || 'kg',
    categoryLink: Boolean(product.link_to_category),
    videoUrl: product.media_type === 'video' ? product.image_url : undefined,
    featured: true,
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

// Fetch products by category with proper filtering
export const fetchProductsByCategory = async (category: string): Promise<ExtendedProduct[]> => {
  try {
    console.log('Fetching products for category:', category);
    
    // Map URL category to database category
    const dbCategory = mapUrlToDatabaseCategory(category);
    
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('category', dbCategory)
      .eq('link_to_category', true);
    
    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} products for category ${dbCategory}`);
    
    if (data && data.length > 0) {
      return data.map(transformProductFromSupabase);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// Helper function to map URL category to database category
const mapUrlToDatabaseCategory = (urlCategory: string): string => {
  if (!urlCategory) return 'vegetable';
  
  const mapping: Record<string, string> = {
    'fruits': 'fruit',
    'vegetables': 'vegetable',
    'légumes': 'vegetable',
    'packs': 'pack',
    'drinks': 'drink',
    'salade-jus': 'salade-jus'
  };
  
  return mapping[urlCategory.toLowerCase()] || urlCategory.toLowerCase();
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
    // Support extended categories
    category: product.category as 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus',
    featured: true, // Always set featured to true since it doesn't exist in DB
    categoryLink: Boolean(product.link_to_category), // Ensure proper conversion
    additionalImages: product.additional_images || []
  }));
};
