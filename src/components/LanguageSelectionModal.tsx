
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelectionModal = () => {
  const { showLanguageModal, setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: 'fr' | 'ar') => {
    setLanguage(lang);
  };

  return (
    <Dialog open={showLanguageModal} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold mb-4">
            Choisissez votre langue / اختر لغتك
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 p-4">
          <Button
            onClick={() => handleLanguageSelect('fr')}
            variant="outline"
            className="h-16 text-lg font-semibold hover:bg-green-50 border-2 hover:border-green-500"
          >
            🇫🇷 Français
          </Button>
          
          <Button
            onClick={() => handleLanguageSelect('ar')}
            variant="outline"
            className="h-16 text-lg font-semibold hover:bg-green-50 border-2 hover:border-green-500"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            🇲🇦 العربية
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Vous pouvez changer la langue à tout moment / يمكنك تغيير اللغة في أي وقت
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionModal;
