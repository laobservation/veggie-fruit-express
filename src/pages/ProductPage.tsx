
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useProductDetails } from '@/hooks/use-product-details';
import { formatPrice } from '@/lib/formatPrice';
import { ServiceOption } from '@/types/product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MediaDisplay from '@/components/MediaDisplay';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  useEffect(() => {
    // Reset scroll position when product changes
    window.scrollTo(0, 0);
    // Reset selected services when product changes
    setSelectedServices([]);
  }, [productId]);

  useEffect(() => {
    // Calculate total price including selected services
    if (product) {
      let servicesTotal = 0;
      selectedServices.forEach(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        if (service) {
          servicesTotal += service.price;
        }
      });
      
      setTotalPrice(product.price + servicesTotal);
    }
  }, [product, selectedServices]);
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1, getSelectedServices());
    }
  };

  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, 1, getSelectedServices());
      openCart(); // Opens the cart/checkout form
    }
  };
  
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };
  
  const getSelectedServices = () => {
    return serviceOptions.filter(service => selectedServices.includes(service.id));
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
        <Footer />
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
            <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
          </div>
        </main>
        <Footer />
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
          <div className="flex justify-between items-center pt-4 pb-2">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <button 
              onClick={handleFavoriteClick} 
              className="p-2"
              aria-label={favoriteStatus ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart 
                className={`h-6 w-6 transition-colors ${favoriteStatus ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>
          
          {/* Product Image */}
          <div className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm">
            <div className="aspect-square">
              <MediaDisplay 
                product={product} 
                className="w-full h-full object-contain p-6"
                autoplay={false}
                controls={true}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <span className="text-2xl font-bold">
                {formatPrice(totalPrice)}/{product.unit}
              </span>
            </div>
            <p className="text-gray-500 mb-6">{categoryText}</p>
            
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            {/* Additional Services for Packs */}
            {isPack && (
              <div className="mt-6 mb-2">
                <h2 className="font-semibold text-lg mb-3">Services additionnels</h2>
                <div className="space-y-3 border-t border-b py-4">
                  {serviceOptions.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3">
                      <Checkbox 
                        id={service.id} 
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => 
                          handleServiceChange(service.id, checked === true)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={service.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {service.name}
                        </Label>
                        <p className="text-xs text-gray-500 rtl:text-right">
                          {service.nameAr}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-lg p-5 mb-20 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Autres {categoryText}</h2>
              <div className="grid grid-cols-4 gap-2">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <div 
                    key={relatedProduct.id} 
                    className="cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between mb-20 md:mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-5 w-5" />
          Ajouter au panier
        </Button>
        
        <Button
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8"
          onClick={handleBuyNow}
        >
          Acheter maintenant
        </Button>
      </div>
      
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default ProductPage;
