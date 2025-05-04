
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';
import { SettingsState } from '@/types/settings';
import SiteInfoForm from './SiteInfoForm';
import ContactForm from './ContactForm';
import CommerceForm from './CommerceForm';

interface SettingsFormProps {
  settings: SettingsState;
  saveLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (checked: boolean, name: string) => void;
  handleSave: () => Promise<void>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  saveLoading,
  handleInputChange,
  handleSwitchChange,
  handleSave
}) => {
  return (
    <div className="space-y-6">
      <SiteInfoForm 
        settings={settings} 
        handleInputChange={handleInputChange} 
      />
      
      <ContactForm 
        settings={settings} 
        handleInputChange={handleInputChange} 
      />
      
      <CommerceForm 
        settings={settings} 
        handleInputChange={handleInputChange} 
        handleSwitchChange={handleSwitchChange} 
      />
      
      <Button 
        onClick={handleSave}
        className="w-full bg-veggie-primary hover:bg-veggie-dark"
        disabled={saveLoading}
      >
        {saveLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Enregistrer les Modifications
          </>
        )}
      </Button>
    </div>
  );
};

export default SettingsForm;
