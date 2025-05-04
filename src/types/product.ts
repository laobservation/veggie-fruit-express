
export interface Product {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable';
  price: number;
  image: string;
  description: string;
  unit: string;
  featured: boolean; // Required property
  videoUrl?: string;
  categoryLink?: boolean;
  stock?: number;
}
