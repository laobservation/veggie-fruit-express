
import React from 'react';
import { Product, ServiceOption } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import ServiceOptions from './ServiceOptions';
import QuantitySelector from './QuantitySelector';
import WeightSelector from './WeightSelector';

interface ProductInfoProps {
  product: Product;
  totalPrice: number;
  isPack: boolean;
  serviceOptions: ServiceOption[];
  selectedService: string | null;
  setSelectedService: (service: string | null) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedWeight?: number;
  onWeightChange?: (weight: number, totalPrice: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  totalPrice,
  isPack,
  serviceOptions,
  selectedService,
  setSelectedService,
  quantity,
  setQuantity,
  selectedWeight,
  onWeightChange
}) => {
  // Check if product is sold by weight (kg)
  const isWeightBased = product.unit === 'kg';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
      
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-green-600">
          {formatPrice(totalPrice)}
        </span>
        {!isWeightBased && (
          <>
            <span className="text-gray-500">/ {product.unit}</span>
            {quantity > 1 && (
              <span className="text-sm text-gray-500">
                ({formatPrice(product.price)} × {quantity})
              </span>
            )}
          </>
        )}
        {isWeightBased && selectedWeight && (
          <span className="text-sm text-gray-500">
            pour {selectedWeight} {product.unit}
          </span>
        )}
      </div>

      {/* Weight Selector - only show for weight-based products */}
      {isWeightBased && onWeightChange && (
        <div className="mb-6">
          <WeightSelector
            basePrice={product.price}
            unit={product.unit}
            onWeightChange={onWeightChange}
            initialWeight={selectedWeight || 1}
          />
        </div>
      )}

      {/* Quantity Selector - only show for non-weight-based products */}
      {!isWeightBased && (
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={1}
          max={50}
        />
      )}

      {/* Service Options - only show for pack category */}
      {product.category === 'pack' && (
        <ServiceOptions
          serviceOptions={serviceOptions}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
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
