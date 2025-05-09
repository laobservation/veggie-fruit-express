
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      title={language === 'fr' ? 'تبديل إلى العربية' : 'Passer au français'}
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
