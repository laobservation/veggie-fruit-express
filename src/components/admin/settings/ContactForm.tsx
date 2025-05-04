
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SettingsState } from '@/types/settings';

interface ContactFormProps {
  settings: SettingsState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  settings,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact</h3>
      
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email de Contact</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Téléphone</Label>
        <Input
          id="contactPhone"
          name="contactPhone"
          value={settings.contactPhone}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          value={settings.address}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ContactForm;
