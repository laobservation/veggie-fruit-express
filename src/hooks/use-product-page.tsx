
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductService } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { transformProductFromSupabase } from '@/services/productService';
import { useCart } from '@/hooks/use-cart';
import { useCartNotification } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/use-favorites';

export const useProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedServices, setSelectedServices] = useState<ProductService[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showNotification } = useCartNotification();
  const productInfoRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteStatus = productId ? isFavorite(productId) : false;
  
  // Derived properties
  const isPack = product?.category === 'pack';
  const categoryText = product?.category || '';
  const categoryPath = `/category/${product?.category || ''}`;
  const serviceOptions: ProductService[] = [
    { id: 'sliced', name: 'Tranché', nameAr: 'مقطع', price: 5 },
    { id: 'peeled', name: 'Épluché', nameAr: 'مقشر', price: 8 }
  ];
  
  // Calculate total price based on product price and selected services
  const totalPrice = product ? 
    product.price + (selectedService ? 
      serviceOptions.find(s => s.id === selectedService)?.price || 0 : 0) : 0;
  
  // Handle favorite button click
  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product);
    }
  };
  
  // Handle buy now button click
  const handleBuyNow = () => {
    if (!product) return;
    
    // Add to cart first
    handleAddToCart();
    
    // Navigate to checkout
    navigate('/checkout');
  };
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Convert productId to number for the database query
        // If it can't be converted to a number, we'll handle that separately
        let parsedId: number;
        
        try {
          parsedId = parseInt(productId);
          if (isNaN(parsedId)) {
            throw new Error('Invalid product ID');
          }
        } catch {
          throw new Error('Invalid product ID format');
        }
        
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('id', parsedId)
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
    if (!productId) return;
    
    try {
      // Convert productId to number for the database query
      // Similar to above, handle the case where it's not a valid number
      let parsedCurrentId: number;
      
      try {
        parsedCurrentId = parseInt(productId);
        if (isNaN(parsedCurrentId)) {
          throw new Error('Invalid product ID');
        }
      } catch {
        console.error('Cannot parse product ID for related products query');
        return;
      }
      
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('category', category)
        .neq('id', parsedCurrentId)
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
    
    // Find the selected service object if a service is selected
    const selectedServiceObjects = selectedService
      ? serviceOptions.filter(s => s.id === selectedService)
      : [];
    
    addItem(product, quantity, selectedServiceObjects);
    
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
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId || null);
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
    selectedService,
    setSelectedService,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    handleServiceSelect,
    totalPrice,
    productInfoRef,
    handleFavoriteClick,
    handleBuyNow,
    favoriteStatus,
    isPack,
    categoryText,
    serviceOptions,
    categoryPath
  };
};
