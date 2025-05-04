
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { useCart } from '@/hooks/use-cart';
import { useProductDetails } from '@/hooks/use-product-details';
import { useStickyCart } from '@/hooks/use-sticky-cart';
import ProductMedia from '@/components/product/ProductMedia';
import ProductDetail from '@/components/product/ProductDetail';
import LoadingState from '@/components/product/LoadingState';
import NotFoundState from '@/components/product/NotFoundState';
import StickyAddToCart from '@/components/product/StickyAddToCart';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { product, relatedProducts, loading } = useProductDetails(productId);
  const { showStickyButton, showSticky } = useStickyCart();
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (!product) {
    return <NotFoundState />;
  }

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
            {/* Product Media */}
            <ProductMedia product={product} />
            
            {/* Product Details */}
            <ProductDetail 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
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
      {product && (
        <StickyAddToCart
          product={product}
          onAddToCart={handleAddToCart}
          isVisible={showStickyButton && showSticky}
        />
      )}
    </div>
  );
};

export default ProductPage;
