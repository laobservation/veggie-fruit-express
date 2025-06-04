
import { useLanguage } from '@/contexts/LanguageContext';

interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  // Header
  'header.location': {
    fr: 'Meknès, Maroc',
    ar: 'مكناس، المغرب'
  },
  'header.delivery': {
    fr: 'Livraison et Préparation 20DH',
    ar: 'التوصيل والتحضير 20 درهم'
  },
  'header.contact': {
    fr: 'Contact',
    ar: 'اتصل بنا'
  },
  'header.favorites': {
    fr: 'Favoris',
    ar: 'المفضلة'
  },
  'header.cart': {
    fr: 'Panier',
    ar: 'السلة'
  },
  
  // Navigation
  'nav.home': {
    fr: 'Accueil',
    ar: 'الرئيسية'
  },
  'nav.categories': {
    fr: 'Categories',
    ar: 'الفئات'
  },
  
  // Categories
  'category.fruits': {
    fr: 'Fruits',
    ar: 'الفواكه'
  },
  'category.vegetables': {
    fr: 'Légumes',
    ar: 'الخضروات'
  },
  'category.packs': {
    fr: 'Packs',
    ar: 'العبوات'
  },
  'category.drinks': {
    fr: 'Boissons',
    ar: 'المشروبات'
  },
  
  // Product Actions
  'product.addToCart': {
    fr: 'Ajouter au panier',
    ar: 'إضافة للسلة'
  },
  'product.viewAll': {
    fr: 'Voir tout',
    ar: 'عرض الكل'
  },
  'product.showMore': {
    fr: 'Afficher plus',
    ar: 'عرض المزيد'
  },
  
  // Home Page
  'home.testimonials.title': {
    fr: 'Témoignages de nos clients',
    ar: 'آراء عملائنا'
  },
  'home.testimonials.subtitle': {
    fr: 'Découvrez ce que nos clients disent de nos produits et services.',
    ar: 'اكتشف ما يقوله عملاؤنا عن منتجاتنا وخدماتنا.'
  },
  
  // Footer
  'footer.copyright': {
    fr: '© {year} Marché Bio',
    ar: '© {year} السوق العضوي'
  },
  
  // Mobile Bottom Nav
  'nav.whatsapp': {
    fr: 'WhatsApp',
    ar: 'واتساب'
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, variables?: { [key: string]: string | number }) => {
    const translation = translations[key]?.[language] || key;
    
    if (variables) {
      return Object.entries(variables).reduce(
        (acc, [varKey, value]) => acc.replace(`{${varKey}}`, String(value)),
        translation
      );
    }
    
    return translation;
  };

  return { t };
};
