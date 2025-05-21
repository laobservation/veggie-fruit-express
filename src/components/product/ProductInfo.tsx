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
    switch (category) {
      case 'fruit':
        return 'Fruits';
      case 'vegetable':
        return 'Légumes';
      case 'pack':
        return 'Packs';
      case 'drink':
        return 'Boissons';
      default:
        return 'Produits';
    }
  };
  return <div className="bg-white rounded-lg p-5 mb-4 shadow-sm mx-0 py-[12px] my-0 px-[12px]">
      <div className="flex flex-col items-center mb-3">
        <h1 className="font-bold text-gray-800 mb-2 text-2xl">{product.name}</h1>
        <div className="text-center">
          <span className="text-2xl font-bold text-green-600 block">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
      
      {/* Show additional services only for products in the pack category */}
      {isPack && <ServiceOptions serviceOptions={serviceOptions} selectedService={selectedService} setSelectedService={setSelectedService} />}
    </div>;
};
export default ProductInfo;