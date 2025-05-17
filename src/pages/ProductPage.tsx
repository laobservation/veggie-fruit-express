
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImage from '@/components/product/ProductImage';
import ProductInfo from '@/components/product/ProductInfo';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductActions from '@/components/product/ProductActions';
import ProductMeta from '@/components/product/ProductMeta';
import ProductLoadingError from '@/components/product/ProductLoadingError';
import CategoryBenefitsSection from '@/components/CategoryBenefitsSection';
import { useProductPage } from '@/hooks/use-product-page';

const ProductPage = () => {
  const {
    product,
    relatedProducts,
    loading,
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
    serviceOptions,
    categoryPath,
  } = useProductPage();
  
  // Show loading state or error if product not found
  if (loading || !product) {
    return <ProductLoadingError loading={loading} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HelmetProvider>
        {/* SEO Meta Tags */}
        <ProductMeta product={product} />

        <Header />
        <main className="flex-grow pb-32">
          <div className="container mx-auto px-4">
            {/* Product Header */}
            <ProductHeader 
              product={product}
              favoriteStatus={favoriteStatus}
              handleFavoriteClick={handleFavoriteClick}
            />
            
            {/* Product Images */}
            {product.additionalImages && product.additionalImages.length > 0 ? (
              <ProductImageGallery 
                product={product}
              />
            ) : (
              <ProductImage product={product} />
            )}
            
            {/* Category Benefits Section */}
            <CategoryBenefitsSection 
              categoryName={categoryText}
              categoryPath={categoryPath}
            />
            
            {/* Product Info - Now includes description above product actions */}
            <div ref={productInfoRef}>
              <ProductInfo
                product={product}
                totalPrice={totalPrice}
                isPack={isPack}
                serviceOptions={serviceOptions}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            </div>
            
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
      </HelmetProvider>
    </div>
  );
};

export default ProductPage;
