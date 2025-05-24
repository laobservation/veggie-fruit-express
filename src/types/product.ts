
export interface Product {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus';
  price: number;
  image: string;
  description?: string;
  unit: string;
  featured?: boolean;
  videoUrl?: string;
  categoryLink?: boolean;
  stock?: number;
  additionalImages?: string[];
  
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  robots_directives?: string;
  structured_data?: any;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_url?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  nameAr: string;
  price: number;
}
