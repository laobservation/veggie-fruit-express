
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
    nameAr: "خضرة مغسولة ومقطعة (فأكياس ��يال 500غ)",
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
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const productInfoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Reset scroll position when product changes
    window.scrollTo(0, 0);
    // Reset selected service when product changes
    setSelectedService(null);
  }, [productId]);

  useEffect(() => {
    // Calculate total price including selected service
    if (product) {
      let servicePrice = 0;
      if (selectedService) {
        const service = productServiceOptions.find(s => s.id === selectedService);
        if (service) {
          servicePrice = service.price;
        }
      }
      
      setTotalPrice(product.price + servicePrice);
    }
  }, [product, selectedService]);
  
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
  
  const handleAddToCart = () => {
    if (product) {
      const selectedServices = selectedService 
        ? [productServiceOptions.find(s => s.id === selectedService)].filter(Boolean) as ServiceOption[]
        : [];
      addItem(product, 1, selectedServices);
    }
  };

  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const selectedServices = selectedService 
        ? [productServiceOptions.find(s => s.id === selectedService)].filter(Boolean) as ServiceOption[]
        : [];
      addItem(product, 1, selectedServices);
      openCart(); // Opens the cart/checkout form
    }
  };

  // Helper function to get formatted category text
  const getCategoryText = (category: 'fruit' | 'vegetable' | 'pack' | 'drink') => {
    switch(category) {
      case 'fruit': return 'Fruits';
      case 'vegetable': return 'Légumes';
      case 'pack': return 'Packs';
      case 'drink': return 'Boissons';
      default: return 'Produits';
    }
  };

  const favoriteStatus = product ? isFavorite(product.id) : false;
  const isPack = product?.category === 'pack';
  const categoryText = product ? getCategoryText(product.category) : '';

  return {
    product,
    relatedProducts,
    loading,
    navigate,
    selectedService,
    setSelectedService,
    totalPrice,
    productInfoRef,
    handleAddToCart,
    handleFavoriteClick,
    handleBuyNow,
    favoriteStatus,
    isPack,
    categoryText,
    serviceOptions: productServiceOptions,
  };
};
