
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import SettingsForm from './settings/SettingsForm';

const WebsiteSettings: React.FC = () => {
  const {
    settings,
    loading,
    saveLoading,
    handleInputChange,
    handleSwitchChange,
    handleSave
  } = useSettings();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <SettingsForm
          settings={settings}
          saveLoading={saveLoading}
          handleInputChange={handleInputChange}
          handleSwitchChange={handleSwitchChange}
          handleSave={handleSave}
        />
      </CardContent>
    </Card>
  );
};

export default WebsiteSettings;
