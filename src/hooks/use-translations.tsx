
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner'; 
import { supabase } from '@/integrations/supabase/client';
import { Translation, TranslationMap, defaultTranslations } from '@/types/translations';
import { Json } from '@/integrations/supabase/types';

interface TranslationsContextType {
  translations: TranslationMap;
  isLoading: boolean;
}

const TranslationsContext = createContext<TranslationsContextType>({
  translations: {},
  isLoading: true
});

export const TranslationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translationMap, setTranslationMap] = useState<TranslationMap>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchTranslations();
    
    // Subscribe to changes in the translations table
    const translationsChannel = supabase
      .channel('translations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations'
        },
        () => {
          fetchTranslations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(translationsChannel);
    };
  }, []);
  
  const fetchTranslations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching translations:', error);
        if (error.code === 'PGRST116') {
          // Table doesn't exist or no data found
          await initializeTranslations();
        } else {
          throw new Error('Failed to fetch translations');
        }
        return;
      }
      
      if (data && data.translations) {
        const translationsData = data.translations as unknown as Translation[];
        const map: TranslationMap = {};
        
        translationsData.forEach(translation => {
          map[translation.key] = translation.fr;
        });
        
        setTranslationMap(map);
      } else {
        await initializeTranslations();
      }
    } catch (error) {
      console.error('Error in fetching translations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const initializeTranslations = async () => {
    try {
      console.log('Initializing translations...');
      
      const { error } = await supabase
        .from('translations')
        .insert({
          id: 1,
          translations: defaultTranslations as unknown as Json
        });
      
      if (error) {
        console.error('Error creating translations:', error);
        throw error;
      }
      
      const map: TranslationMap = {};
      defaultTranslations.forEach(translation => {
        map[translation.key] = translation.fr;
      });
      
      setTranslationMap(map);
      toast.success('Traductions initialisées avec succès');
    } catch (error) {
      console.error('Error initializing translations:', error);
      toast.error('Échec de l\'initialisation des traductions');
    }
  };
  
  return (
    <TranslationsContext.Provider value={{ translations: translationMap, isLoading }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};

export const useTranslationsAdmin = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Fetch translations from database
  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching translations:', error);
        if (error.code === 'PGRST116') {
          // Table doesn't exist or no data found
          await initializeTranslations();
        } else {
          throw new Error('Failed to fetch translations');
        }
        return;
      }
      
      if (data && data.translations) {
        const translationsData = data.translations as unknown as Translation[];
        setTranslations(translationsData);
      } else {
        await initializeTranslations();
      }
    } catch (error) {
      console.error('Error in fetching translations:', error);
      toast.error('Échec du chargement des traductions');
    } finally {
      setLoading(false);
    }
  };
  
  const initializeTranslations = async () => {
    try {
      console.log('Initializing translations...');
      
      const { error } = await supabase
        .from('translations')
        .insert({
          id: 1,
          translations: defaultTranslations as unknown as Json
        });
      
      if (error) {
        console.error('Error creating translations:', error);
        throw error;
      }
      
      setTranslations(defaultTranslations);
      toast.success('Traductions initialisées avec succès');
    } catch (error) {
      console.error('Error initializing translations:', error);
      toast.error('Échec de l\'initialisation des traductions');
    }
  };
  
  const saveTranslations = async (updatedTranslations: Translation[]) => {
    setSaveLoading(true);
    try {
      const { error } = await supabase
        .from('translations')
        .update({
          translations: updatedTranslations as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Error saving translations:', error);
        throw error;
      }
      
      setTranslations(updatedTranslations);
      toast.success('Traductions enregistrées avec succès');
      return true;
    } catch (error) {
      console.error('Error saving translations:', error);
      toast.error('Échec de l\'enregistrement des traductions');
      return false;
    } finally {
      setSaveLoading(false);
    }
  };
  
  const updateTranslation = (key: string, value: string) => {
    const updatedTranslations = translations.map(translation =>
      translation.key === key ? { ...translation, fr: value } : translation
    );
    setTranslations(updatedTranslations);
  };
  
  const addTranslation = (translation: Translation) => {
    setTranslations([...translations, translation]);
  };
  
  const deleteTranslation = (key: string) => {
    const updatedTranslations = translations.filter(
      translation => translation.key !== key
    );
    setTranslations(updatedTranslations);
  };
  
  useEffect(() => {
    fetchTranslations();
  }, []);
  
  return {
    translations,
    loading,
    saveLoading,
    updateTranslation,
    addTranslation,
    deleteTranslation,
    saveTranslations
  };
};

// Helper function to translate text
export const t = (key: string, translations: TranslationMap, fallback?: string): string => {
  return translations[key] || fallback || key;
};
