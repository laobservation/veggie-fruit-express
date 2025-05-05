
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  color: string;
  image: string;
}

interface PromotionSliderProps {
  promotions: Promotion[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ promotions }) => {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 mb-8 px-4 md:px-0">
      {promotions.map((promo) => (
        <div 
          key={promo.id} 
          className={`${promo.color} rounded-xl flex-shrink-0 w-full md:w-1/3 h-48 flex items-center p-6 text-white`}
        >
          <h3 className="text-2xl font-bold max-w-[50%] leading-tight">{promo.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default PromotionSlider;
