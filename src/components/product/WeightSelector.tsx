
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WeightSelectorProps {
  selectedWeight: number;
  onWeightChange: (weight: number) => void;
  unit: string;
}

const WeightSelector: React.FC<WeightSelectorProps> = ({
  selectedWeight,
  onWeightChange,
  unit
}) => {
  const [customWeight, setCustomWeight] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Preset weight options
  const presetWeights = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5];

  // Handle preset weight selection
  const handlePresetWeightChange = (value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
      setCustomWeight(selectedWeight.toString());
    } else {
      setIsCustom(false);
      const weight = parseFloat(value);
      onWeightChange(weight);
    }
  };

  // Handle custom weight input
  const handleCustomWeightChange = (value: string) => {
    setCustomWeight(value);
    
    // Validate and parse the input
    const weight = parseFloat(value);
    
    if (!isNaN(weight) && weight > 0 && weight <= 50) {
      onWeightChange(weight);
    }
  };

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

      <div className="text-xs text-gray-500">
        * Les prix sont calculés automatiquement selon le poids sélectionné
      </div>
    </div>
  );
};

export default WeightSelector;
