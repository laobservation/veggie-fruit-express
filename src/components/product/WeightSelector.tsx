
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/formatPrice';

interface WeightSelectorProps {
  basePrice: number;
  unit: string;
  onWeightChange: (weight: number, totalPrice: number) => void;
  initialWeight?: number;
}

const WeightSelector: React.FC<WeightSelectorProps> = ({
  basePrice,
  unit,
  onWeightChange,
  initialWeight = 1
}) => {
  const [selectedWeight, setSelectedWeight] = useState<number>(initialWeight);
  const [customWeight, setCustomWeight] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(basePrice * initialWeight);

  // Preset weight options
  const presetWeights = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5];

  // Calculate price based on weight
  const calculatePrice = (weight: number): number => {
    return Math.round((basePrice * weight) * 100) / 100; // Round to 2 decimal places
  };

  // Handle preset weight selection
  const handlePresetWeightChange = (value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
      setCustomWeight(selectedWeight.toString());
    } else {
      setIsCustom(false);
      const weight = parseFloat(value);
      setSelectedWeight(weight);
      const price = calculatePrice(weight);
      setTotalPrice(price);
      onWeightChange(weight, price);
    }
  };

  // Handle custom weight input
  const handleCustomWeightChange = (value: string) => {
    setCustomWeight(value);
    
    // Validate and parse the input
    const weight = parseFloat(value);
    
    if (!isNaN(weight) && weight > 0 && weight <= 50) {
      setSelectedWeight(weight);
      const price = calculatePrice(weight);
      setTotalPrice(price);
      onWeightChange(weight, price);
    }
  };

  // Initialize the component
  useEffect(() => {
    const price = calculatePrice(initialWeight);
    setTotalPrice(price);
    onWeightChange(initialWeight, price);
  }, [basePrice, initialWeight]);

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <Label htmlFor="weight-selector" className="text-sm font-medium text-gray-700 mb-2 block">
          Choisissez le poids souhaité
        </Label>
        
        <Select 
          value={isCustom ? 'custom' : selectedWeight.toString()} 
          onValueChange={handlePresetWeightChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner le poids" />
          </SelectTrigger>
          <SelectContent>
            {presetWeights.map((weight) => (
              <SelectItem key={weight} value={weight.toString()}>
                {weight} {unit}
              </SelectItem>
            ))}
            <SelectItem value="custom">Poids personnalisé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isCustom && (
        <div>
          <Label htmlFor="custom-weight" className="text-sm font-medium text-gray-700 mb-2 block">
            Entrez le poids personnalisé ({unit})
          </Label>
          <Input
            id="custom-weight"
            type="number"
            step="0.01"
            min="0.01"
            max="50"
            value={customWeight}
            onChange={(e) => handleCustomWeightChange(e.target.value)}
            placeholder={`Ex: 1.75 ${unit}`}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum: 0.01{unit}, Maximum: 50{unit}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between p-3 bg-white rounded-md border">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedWeight} {unit}</span>
          <span className="text-gray-500"> × {formatPrice(basePrice)}/{unit}</span>
        </div>
        <div className="text-lg font-bold text-green-600">
          {formatPrice(totalPrice)}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        * Les prix sont calculés automatiquement selon le poids sélectionné
      </div>
    </div>
  );
};

export default WeightSelector;
