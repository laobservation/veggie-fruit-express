
import React from 'react';
import { Product } from '@/types/product';
import { ServiceOption } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';
import ServiceOptions from './ServiceOptions';

interface ProductInfoProps {
  product: Product;
  totalPrice: number;
  isPack: boolean;
  serviceOptions: ServiceOption[];
  selectedService: string | null;
  setSelectedService: (value: string | null) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  totalPrice,
  isPack,
  serviceOptions,
  selectedService,
  setSelectedService
}) => {
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

  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="text-right">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(totalPrice)}
          </span>
          <span className="text-sm text-gray-500 block">/{product.unit}</span>
        </div>
      </div>
      <p className="text-gray-500 mb-4">{getCategoryText(product.category)}</p>
      
      {/* Additional Services */}
      <ServiceOptions 
        serviceOptions={serviceOptions}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />
      
      <h2 className="font-semibold text-lg mb-2">Description</h2>
      <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
    </div>
  );
};

export default ProductInfo;
