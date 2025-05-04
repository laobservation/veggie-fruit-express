
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  unit: string;
  featured: boolean; // Change from optional to required
  videoUrl?: string;
  categoryLink?: boolean;
  stock?: number;
}
