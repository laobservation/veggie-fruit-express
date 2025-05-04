
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { transformProductFromSupabase } from '@/services/productService';
import { getProductById, getProductsByCategory } from '@/data/products';

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
            const typedProduct: Product = {
              ...localProduct,
              category: localProduct.category, // Already correctly typed in local data
              featured: localProduct.featured || false
            };
            
            setProduct(typedProduct);
            
            // Get related products for this product
            const related = getProductsByCategory(typedProduct.category)
              .filter(p => p.id !== typedProduct.id)
              .slice(0, 4);
              
            setRelatedProducts(related.map(p => ({
              ...p,
              featured: p.featured || false
            })));
          } else {
            // Product not found anywhere
            console.error('Product not found');
          }
        } else {
          // Transform Supabase product data - no need to manually add featured property
          const transformedProduct = transformProductFromSupabase(supabaseProduct);
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
            setRelatedProducts(relatedData.map(p => transformProductFromSupabase(p)));
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
