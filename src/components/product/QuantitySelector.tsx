
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    onQuantityChange(clampedValue);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm font-medium text-gray-700">Quantité:</span>
      <div className="flex items-center border border-gray-200 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="h-10 w-10 p-0 hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-16 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="h-10 w-10 p-0 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
