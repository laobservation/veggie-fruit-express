
import React from 'react';
import { Product, ServiceOption } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import ServiceOptions from './ServiceOptions';
import QuantitySelector from './QuantitySelector';

interface ProductInfoProps {
  product: Product;
  totalPrice: number;
  isPack: boolean;
  serviceOptions: ServiceOption[];
  selectedService: string | null;
  setSelectedService: (service: string | null) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  totalPrice,
  isPack,
  serviceOptions,
  selectedService,
  setSelectedService,
  quantity,
  setQuantity
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
      
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-green-600">
          {formatPrice(totalPrice)}
        </span>
        <span className="text-gray-500">/ {product.unit}</span>
        {quantity > 1 && (
          <span className="text-sm text-gray-500">
            ({formatPrice(product.price)} × {quantity})
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        min={1}
        max={50}
      />

      {/* Service Options - only show for vegetables */}
      {product.category === 'vegetable' && !isPack && (
        <ServiceOptions
          serviceOptions={serviceOptions}
          selectedService={selectedService}
          onServiceChange={setSelectedService}
        />
      )}

      {/* Product Description */}
      {product.description && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
