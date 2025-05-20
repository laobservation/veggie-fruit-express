
export interface Product {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable' | 'pack' | 'drink' | 'salade-jus';
  price: number;
  image: string;
  description: string;
  unit: string;
  featured: boolean; // Required property
  videoUrl?: string;
  categoryLink?: boolean;
  stock?: number;
  additionalImages?: string[]; // Array of additional image URLs
}

export interface ProductService {
  id: string;
  name: string;
  nameAr: string;
  price: number;
}

export interface ServiceOption {
  id: string;
  name: string;
  nameAr: string;
  price: number;
}
