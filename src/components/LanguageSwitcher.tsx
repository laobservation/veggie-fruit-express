
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-gray-600 hover:text-green-600"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'fr' ? 'العربية' : 'FR'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
