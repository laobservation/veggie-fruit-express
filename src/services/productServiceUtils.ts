
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const validateProductForm = (formData: Product, mediaType: 'image' | 'video'): { isValid: boolean; errorMessage?: string } => {
  // Check required fields
  if (!formData.name || !formData.description || formData.price <= 0) {
    return {
      isValid: false,
      errorMessage: "Veuillez remplir tous les champs requis."
    };
  }
  
  // Validate media based on type
  if (mediaType === 'image' && !formData.image) {
    return {
      isValid: false,
      errorMessage: "Veuillez ajouter une URL d'image."
    };
  }
  
  if (mediaType === 'video' && !formData.videoUrl) {
    return {
      isValid: false,
      errorMessage: "Veuillez ajouter une URL YouTube."
    };
  }
  
  return { isValid: true };
};

export const prepareProductData = (formData: Product, mediaType: 'image' | 'video'): Product => {
  const finalFormData = {...formData};
  
  if (mediaType === 'image') {
    finalFormData.videoUrl = '';
  } else {
    // For video, ensure there's a placeholder image if image is empty
    if (!finalFormData.image) {
      finalFormData.image = '/images/placeholder.svg';
    }
  }
  
  return finalFormData;
};
