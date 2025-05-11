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
  return <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="text-right">
          <span className="text-xl font-bold text-green-600 mx-0 text-center my-0 py-0">
            {formatPrice(totalPrice)}
          </span>
          
        </div>
      </div>
      <p className="text-gray-500 mb-3">{getCategoryText(product.category)}</p>
      
      {/* Additional Services - Moved up to appear without scrolling */}
      <ServiceOptions serviceOptions={serviceOptions} selectedService={selectedService} setSelectedService={setSelectedService} />
    </div>;
};
export default ProductInfo;