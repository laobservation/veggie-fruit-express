
import React from 'react';
import { Product, ServiceOption } from '@/types/product';
import ServiceOptions from './ServiceOptions';
import WeightSelector from './WeightSelector';
import QuantitySelector from './QuantitySelector';

interface ProductInfoProps {
  product: Product;
  totalPrice: number;
  isPack: boolean;
  serviceOptions: ServiceOption[];
  selectedService: ServiceOption | null;
  setSelectedService: (service: ServiceOption | null) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedWeight: number;
  onWeightChange: (weight: number) => void;
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
  onWeightChange,
}) => {
  const isPackCategory = product.category === 'pack';

  return (
    <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
      
      {product.description && (
        <p className="text-gray-600 mb-4">{product.description}</p>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold text-green-600">
          {totalPrice.toFixed(2)} DH
        </span>
        <span className="text-sm text-gray-500">/{product.unit}</span>
      </div>

      {/* Service Options - Show for all products */}
      {serviceOptions.length > 0 && (
        <ServiceOptions
          options={serviceOptions}
          selectedService={selectedService}
          onServiceChange={setSelectedService}
        />
      )}

      {/* Weight Selector - Show for non-pack products */}
      {!isPackCategory && (
        <WeightSelector
          selectedWeight={selectedWeight}
          onWeightChange={onWeightChange}
          unit={product.unit}
        />
      )}

      {/* Quantity Selector - Only show for non-pack products */}
      {!isPackCategory && (
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      )}
    </div>
  );
};

export default ProductInfo;
