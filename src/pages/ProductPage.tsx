
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/data/products';
import { useCart } from '@/hooks/use-cart';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory } from '@/data/products';
import { useIsMobile } from '@/hooks/use-mobile';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = getProductById(productId || '');
  const isMobile = useIsMobile();
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Add scroll listener to show/hide sticky button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // If we've scrolled down past the initial view of the add to cart button
      if (scrollPosition > 300) {
        setShowStickyButton(true);
        
        // Hide the button when nearing the bottom of the page
        if (scrollPosition + windowHeight > documentHeight - 200) {
          setShowSticky(false);
        } else {
          setShowSticky(true);
        }
      } else {
        setShowStickyButton(false);
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
          <p className="mb-8">Désolé, nous n'avons pas pu trouver le produit que vous cherchez.</p>
          <Button onClick={() => navigate('/')}>Retour à l'Accueil</Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const categoryText = product.category === 'fruit' ? 'Fruits' : 'Légumes';

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-veggie-light px-2 py-1 text-xs font-medium text-veggie-dark mb-2">
                  {product.category === 'fruit' ? 'Fruit' : 'Légume'}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold text-veggie-dark mb-2">
                  {product.price.toFixed(2)}€ <span className="text-sm text-gray-500">/ {product.unit}</span>
                </p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="mt-auto">
                <Button 
                  onClick={handleAddToCart}
                  className="bg-veggie-primary hover:bg-veggie-dark text-white w-full md:w-auto rounded-md"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au Panier
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <ProductGrid 
              products={relatedProducts} 
              title={`Plus de ${categoryText} que vous pourriez aimer`}
            />
          )}
        </div>
      </main>
      <Footer />
      
      {/* Sticky Add to Cart Button */}
      {showStickyButton && (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'} z-50`}>
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-xl font-semibold text-veggie-dark">{product.price.toFixed(2)}€</p>
            </div>
            <Button 
              onClick={handleAddToCart}
              className="bg-veggie-primary hover:bg-veggie-dark text-white"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Ajouter au Panier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
