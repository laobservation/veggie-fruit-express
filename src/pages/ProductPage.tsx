
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useProductDetails } from '@/hooks/use-product-details';
import { formatPrice } from '@/lib/formatPrice';
import { Product } from '@/types/product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MediaDisplay from '@/components/MediaDisplay';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { product, relatedProducts, loading } = useProductDetails(productId);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  useEffect(() => {
    // Reset scroll position when product changes
    window.scrollTo(0, 0);
  }, [productId]);
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product);
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
        <Footer />
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
      </div>
    );
  }

  const categoryText = getCategoryText(product.category);
  const favoriteStatus = isFavorite(product.id);

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
              <span className="text-2xl font-bold">{formatPrice(product.price)}/{product.unit}</span>
            </div>
            <p className="text-gray-500 mb-6">{categoryText}</p>
            
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Plus de {categoryText}</h2>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-5 w-5" />
          Ajouter au panier
        </Button>
        
        <Button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
          onClick={() => {
            handleAddToCart();
            navigate('/checkout');
          }}
        >
          Acheter maintenant
        </Button>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
