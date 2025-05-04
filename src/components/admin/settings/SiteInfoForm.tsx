
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SettingsState } from '@/types/settings';

interface SiteInfoFormProps {
  settings: SettingsState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SiteInfoForm: React.FC<SiteInfoFormProps> = ({
  settings,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations du Site</h3>
      
      <div className="space-y-2">
        <Label htmlFor="siteName">Nom du Site</Label>
        <Input
          id="siteName"
          name="siteName"
          value={settings.siteName}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={settings.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default SiteInfoForm;
