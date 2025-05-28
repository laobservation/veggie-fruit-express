
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useProductDetails } from '@/hooks/use-product-details';
import { Product, ServiceOption } from '@/types/product';

// Define service options to be used in the product page
export const productServiceOptions: ServiceOption[] = [
  {
    id: "washed",
    name: "Légumes lavés et prêts à l'emploi (+10,00 Dh)",
    nameAr: "خضرة مغسولة و منظفة، وجاهزة للاستعمال",
    price: 10
  },
  {
    id: "cut",
    name: "Légumes lavés et coupés (+20,00 Dh)",
    nameAr: "خضرة مغسولة ومقطعة",
    price: 20
  },
  {
    id: "bags",
    name: "Légumes lavés et coupés (Sachets de 500g) (+35,00 Dh)",
    nameAr: "خضرة مغسولة ومقطعة (فأكياس ديال 500غ)",
    price: 35
  }
];

export const useProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { product, relatedProducts, loading } = useProductDetails(productId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedWeight, setSelectedWeight] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const productInfoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Reset scroll position when product changes
    window.scrollTo(0, 0);
    // Reset selected service, quantity, and weight when product changes
    setSelectedService(null);
    setQuantity(1);
    setSelectedWeight(1);
  }, [productId]);

  useEffect(() => {
    // Calculate total price including selected service and quantity/weight
    if (product) {
      let servicePrice = 0;
      if (selectedService) {
        const service = productServiceOptions.find(s => s.id === selectedService);
        if (service) {
          servicePrice = service.price;
        }
      }
      
      // For weight-based products, use selectedWeight; for others, use quantity
      const isWeightBased = product.unit === 'kg';
      const multiplier = isWeightBased ? selectedWeight : quantity;
      
      setTotalPrice((product.price * multiplier) + (servicePrice * (isWeightBased ? 1 : quantity)));
    }
  }, [product, selectedService, quantity, selectedWeight]);
  
  // Add automatic scroll to product info section
  useEffect(() => {
    if (!loading && product && productInfoRef.current) {
      setTimeout(() => {
        productInfoRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }, 500);
    }
  }, [loading, product]);

  // Handle weight change for weight-based products
  const handleWeightChange = (weight: number) => {
    setSelectedWeight(weight);
  };
  
  const handleAddToCart = () => {
    if (product) {
      const selectedServices = selectedService 
        ? [productServiceOptions.find(s => s.id === selectedService)].filter(Boolean) as ServiceOption[]
        : [];
      
      // For weight-based products, use selectedWeight as quantity
      const isWeightBased = product.unit === 'kg';
      const cartQuantity = isWeightBased ? selectedWeight : quantity;
      
      addItem(product, cartQuantity, selectedServices);
    }
  };

  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product);
      
      // Dispatch custom event for favorite animation
      document.dispatchEvent(new CustomEvent('favorite-updated'));
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const selectedServices = selectedService 
        ? [productServiceOptions.find(s => s.id === selectedService)].filter(Boolean) as ServiceOption[]
        : [];
      
      // For weight-based products, use selectedWeight as quantity
      const isWeightBased = product.unit === 'kg';
      const cartQuantity = isWeightBased ? selectedWeight : quantity;
      
      addItem(product, cartQuantity, selectedServices);
      openCart(); // Opens the cart/checkout form
    }
  };

  // Helper function to get formatted category text
  const getCategoryText = (category: string) => {
    switch(category) {
      case 'fruit': return 'Fruits';
      case 'vegetable': return 'Légumes';
      case 'pack': return 'Packs';
      case 'drink': return 'Boissons';
      case 'salade-jus': return 'Salades & Jus';
      default: return 'Produits';
    }
  };

  // Get category path for linking
  const getCategoryPath = (category: string) => {
    switch(category) {
      case 'fruit': return '/category/fruits';
      case 'vegetable': return '/category/légumes';
      case 'pack': return '/category/packs';
      case 'drink': return '/category/drinks';
      case 'salade-jus': return '/category/salade-jus';
      default: return '/';
    }
  };

  const favoriteStatus = product ? isFavorite(product.id) : false;
  const isPack = product?.category === 'pack';
  const categoryText = product ? getCategoryText(product.category) : '';
  const categoryPath = product ? getCategoryPath(product.category) : '';

  return {
    product,
    relatedProducts,
    loading,
    navigate,
    selectedService,
    setSelectedService,
    quantity,
    setQuantity,
    selectedWeight,
    handleWeightChange,
    totalPrice,
    productInfoRef,
    handleAddToCart,
    handleFavoriteClick,
    handleBuyNow,
    favoriteStatus,
    isPack,
    categoryText,
    categoryPath,
    serviceOptions: productServiceOptions,
  };
};
