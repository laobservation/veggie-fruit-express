
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductService } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { transformProductFromSupabase } from '@/services/productService';
import { useCart } from '@/hooks/use-cart';
import { useCartNotification } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';

export const useProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedServices, setSelectedServices] = useState<ProductService[]>([]);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showNotification } = useCartNotification();
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error('Product not found');
        }
        
        // Transform the product from database format to our application format
        const productData = transformProductFromSupabase({
          ...data,
          additional_images: data.additional_images || null
        });
        
        setProduct(productData);
        
        // Fetch related products in the same category
        fetchRelatedProducts(productData.category);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Fetch related products
  const fetchRelatedProducts = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('category', category)
        .neq('id', productId)
        .limit(4);
      
      if (error) {
        throw error;
      }
      
      setRelatedProducts(
        data.map(product => transformProductFromSupabase({
          ...product,
          additional_images: product.additional_images || null
        }))
      );
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };
  
  // Add to cart function
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, quantity, selectedServices);
    
    // Show notification
    showNotification(product, quantity);
    
    // Show success toast
    toast({
      title: "Produit ajouté!",
      description: `${product.name} a été ajouté à votre panier.`,
      variant: "default",
    });
  };
  
  // Handle service selection
  const handleServiceSelect = (service: ProductService) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  return {
    product,
    loading,
    error,
    relatedProducts,
    quantity,
    selectedServices,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    handleServiceSelect
  };
};
