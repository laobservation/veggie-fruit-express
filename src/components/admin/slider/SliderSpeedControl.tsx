
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

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
    onSpeedChange(values);
    toast({
      title: "Vitesse mise à jour",
      description: `La vitesse du slider est maintenant de ${values[0]} secondes.`,
    });
  };

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
            value={speed}
            onValueChange={handleSliderSpeedChange}
          />
        </div>
        <div className="text-center text-sm text-gray-500">
          {speed[0]} {speed[0] === 1 ? 'seconde' : 'secondes'} par diapositive
        </div>
      </div>
    </div>
  );
};

export default SliderSpeedControl;
