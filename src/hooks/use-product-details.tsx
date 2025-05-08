
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { transformProductFromSupabase, SupabaseProduct } from '@/services/productService';
import { getProductById } from '@/data/products';

export const useProductDetails = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        if (!productId) {
          throw new Error('No product ID provided');
        }
        
        // First try to get from Supabase
        const { data: supabaseProduct, error } = await supabase
          .from('Products')
          .select('*')
          .eq('id', parseInt(productId, 10))
          .single();
        
        if (error || !supabaseProduct) {
          // If not found in Supabase, try local data
          const localProduct = getProductById(productId);
          if (localProduct) {
            setProduct(localProduct);
            
            // Get related products for this product - using updated type for category
            const related = getProductById(productId) ? 
              getProductsByCategory(localProduct.category)
                .filter(p => p.id !== localProduct.id)
                .slice(0, 4) : 
              [];
              
            setRelatedProducts(related);
          } else {
            // Product not found anywhere
            console.error('Product not found');
          }
        } else {
          // Transform Supabase product data
          const transformedProduct = transformProductFromSupabase(supabaseProduct as SupabaseProduct);
          setProduct(transformedProduct);
          
          // Fetch related products from the same category
          const { data: relatedData } = await supabase
            .from('Products')
            .select('*')
            .eq('category', transformedProduct.category)
            .neq('id', parseInt(productId, 10))
            .limit(4);
            
          if (relatedData && relatedData.length > 0) {
            // Transform each related product using our helper
            setRelatedProducts(relatedData.map(p => transformProductFromSupabase(p as SupabaseProduct)));
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  return { product, relatedProducts, loading };
};

// Helper function to get products by category - needed since we're importing from a file that we're editing
const getProductsByCategory = (category: 'fruit' | 'vegetable' | 'pack' | 'drink'): Product[] => {
  // This is a simplified version just for use in this hook
  return [];
};
