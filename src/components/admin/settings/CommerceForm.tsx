
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SettingsState } from '@/types/settings';

interface CommerceFormProps {
  settings: SettingsState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (checked: boolean, name: string) => void;
}

const CommerceForm: React.FC<CommerceFormProps> = ({
  settings,
  handleInputChange,
  handleSwitchChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Commerce</h3>
      
      <div className="space-y-2">
        <Label htmlFor="currency">Devise</Label>
        <Input
          id="currency"
          name="currency"
          value={settings.currency}
          onChange={handleInputChange}
        />
        <p className="text-xs text-gray-500">Exemple: DH, €, $</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="enableDelivery">Activer la Livraison</Label>
          <p className="text-xs text-gray-500">Permettre aux clients de se faire livrer</p>
        </div>
        <Switch
          id="enableDelivery"
          checked={settings.enableDelivery}
          onCheckedChange={(checked) => handleSwitchChange(checked, 'enableDelivery')}
        />
      </div>
      
      {settings.enableDelivery && (
        <div className="space-y-2">
          <Label htmlFor="deliveryFee">Frais de Livraison (DH)</Label>
          <Input
            id="deliveryFee"
            name="deliveryFee"
            type="number"
            value={settings.deliveryFee}
            onChange={handleInputChange}
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="enablePayments">Activer les Paiements en Ligne</Label>
          <p className="text-xs text-gray-500">Permettre aux clients de payer en ligne</p>
        </div>
        <Switch
          id="enablePayments"
          checked={settings.enablePayments}
          onCheckedChange={(checked) => handleSwitchChange(checked, 'enablePayments')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="minimumOrderValue">Montant Minimum de Commande (DH)</Label>
        <Input
          id="minimumOrderValue"
          name="minimumOrderValue"
          type="number"
          value={settings.minimumOrderValue}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CommerceForm;
