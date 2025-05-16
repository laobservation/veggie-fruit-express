
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const DeliveryTimeSelector: React.FC = () => {
  const form = useFormContext();
  const preferDeliveryTime = form.watch('preferDeliveryTime');
  
  return (
    <>
      <FormField
        control={form.control}
        name="deliveryDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jour de livraison</FormLabel>
            <FormControl>
              <Input placeholder="Jour de livraison souhaité" {...field} />
            </FormControl>
            <FormDescription>
              Par exemple: Lundi, Mardi, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="preferDeliveryTime"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Heure de livraison spécifique</FormLabel>
              <FormDescription>
                Spécifiez une heure de livraison préférée
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {preferDeliveryTime && (
        <FormField
          control={form.control}
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="matin" id="matin" />
                    <Label htmlFor="matin">Matin (8h - 12h)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="après-midi" id="après-midi" />
                    <Label htmlFor="après-midi">Après-midi (14h - 18h)</Label>
                  </div>
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

export default DeliveryTimeSelector;
