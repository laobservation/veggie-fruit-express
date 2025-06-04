
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // Check if user has already selected a language
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    } else {
      // Show language selection modal for first-time visitors
      setShowLanguageModal(true);
    }
  }, []);

  // Update document direction and language when language changes
  useEffect(() => {
    const html = document.documentElement;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
    html.lang = language;
    
    // Add/remove RTL class for Tailwind CSS
    if (language === 'ar') {
      html.classList.add('rtl');
    } else {
      html.classList.remove('rtl');
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    setShowLanguageModal(false);
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        isRTL, 
        showLanguageModal, 
        setShowLanguageModal 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
