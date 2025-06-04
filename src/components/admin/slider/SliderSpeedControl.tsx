
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { sanitizeNumber } from '@/utils/security';

interface SliderSpeedControlProps {
  speed: number[];
  onSpeedChange: (values: number[]) => void;
}

const SliderSpeedControl: React.FC<SliderSpeedControlProps> = ({
  speed,
  onSpeedChange
}) => {
  const { toast } = useToast();

  const handleSliderSpeedChange = (values: number[]) => {
    // Security: Validate and sanitize input
    const sanitizedValues = values.map(val => {
      const sanitized = sanitizeNumber(val);
      return Math.min(Math.max(sanitized, 1), 10); // Clamp between 1 and 10
    });

    onSpeedChange(sanitizedValues);
    toast({
      title: "Vitesse mise à jour",
      description: `La vitesse du slider est maintenant de ${sanitizedValues[0]} secondes.`,
    });
  };

  // Security: Validate current speed values
  const validatedSpeed = speed.map(val => Math.min(Math.max(val, 1), 10));

  return (
    <div className="mb-6 space-y-4">
      <div>
        <Label>Vitesse du slider (secondes)</Label>
        <div className="py-4">
          <Slider 
            defaultValue={[5]} 
            max={10} 
            min={1}
            step={1}
            value={validatedSpeed}
            onValueChange={handleSliderSpeedChange}
          />
        </div>
        <div className="text-center text-sm text-gray-500">
          {validatedSpeed[0]} {validatedSpeed[0] === 1 ? 'seconde' : 'secondes'} par diapositive
        </div>
      </div>
    </div>
  );
};

export default SliderSpeedControl;
