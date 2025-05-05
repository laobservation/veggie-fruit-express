
import React from 'react';
import { Control } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormValues } from './DeliveryFormContainer';

interface DeliveryTimeFieldsProps {
  control: Control<FormValues>;
  preferDeliveryTime: boolean;
}

const DeliveryTimeFields: React.FC<DeliveryTimeFieldsProps> = ({ 
  control, 
  preferDeliveryTime 
}) => {
  return (
    <>
      <FormField
        control={control}
        name="preferDeliveryTime"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Je préfère choisir une heure de livraison
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      {preferDeliveryTime && (
        <FormField
          control={control}
          name="deliveryTime"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Heure de livraison préférée</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="matin" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Matin (8h - 12h)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="apres-midi" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Après-midi (13h - 17h)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="soir" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Soir (17h - 20h)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default DeliveryTimeFields;
