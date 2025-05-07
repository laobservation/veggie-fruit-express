
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useProductDetails } from '@/hooks/use-product-details';
import { ServiceOption } from '@/types/product';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useState, useEffect } from 'react';

// Import the newly created components
import ProductHeader from '@/components/product/ProductHeader';
import ProductImage from '@/components/product/ProductImage';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductActions from '@/components/product/ProductActions';

// Define additional service options
const serviceOptions: ServiceOption[] = [
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

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { product, relatedProducts, loading } = useProductDetails(productId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
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
        const service = serviceOptions.find(s => s.id === selectedService);
        if (service) {
          servicePrice = service.price;
        }
      }
      
      setTotalPrice(product.price + servicePrice);
    }
  }, [product, selectedService]);
  
  const handleAddToCart = () => {
    if (product) {
      const selectedServices = selectedService 
        ? [serviceOptions.find(s => s.id === selectedService)].filter(Boolean) as ServiceOption[]
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
        ? [serviceOptions.find(s => s.id === selectedService)].filter(Boolean) as ServiceOption[]
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse w-full max-w-md h-96 bg-gray-200 rounded-lg"></div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
            <button onClick={() => navigate('/')}>Retour à l'accueil</button>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  const categoryText = getCategoryText(product.category);
  const favoriteStatus = isFavorite(product.id);
  const isPack = product.category === 'pack';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          {/* Product Header */}
          <ProductHeader 
            product={product}
            favoriteStatus={favoriteStatus}
            handleFavoriteClick={handleFavoriteClick}
          />
          
          {/* Product Image */}
          <ProductImage product={product} />
          
          {/* Product Info */}
          <ProductInfo
            product={product}
            totalPrice={totalPrice}
            isPack={isPack}
            serviceOptions={serviceOptions}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
          
          {/* Related Products */}
          <RelatedProducts 
            products={relatedProducts}
            categoryText={categoryText}
          />
        </div>
      </main>
      
      {/* Fixed Bottom Action Bar */}
      <ProductActions 
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />
      
      <MobileBottomNav />
    </div>
  );
};

export default ProductPage;
