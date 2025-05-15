
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types/product';

interface ProductMetaProps {
  product: Product;
}

const ProductMeta: React.FC<ProductMetaProps> = ({ product }) => {
  // Create absolute URL for product image for SEO tags
  const baseUrl = window.location.origin;
  const productImageUrl = product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`;
  const productUrl = `${baseUrl}/product/${product.id}`;

  return (
    <Helmet>
      <title>{product.name} | Marché Bio</title>
      <meta name="description" content={product.description || `${product.name} - ${product.price.toFixed(2)} DH`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.description || `${product.price.toFixed(2)} DH`} />
      <meta property="og:image" content={productImageUrl} />
      <meta property="og:url" content={productUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={product.description || `${product.price.toFixed(2)} DH`} />
      <meta name="twitter:image" content={productImageUrl} />
    </Helmet>
  );
};

export default ProductMeta;
