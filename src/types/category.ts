
// Define the Category interface
export interface Category {
  id: string;
  name: string;
  imageIcon: string | null;
  bg: string;
  path?: string;
  isVisible?: boolean;
  displayOrder?: number;
}

export interface NewCategoryFormData extends Omit<Category, 'id' | 'path'> {
  name: string;
  imageIcon: string | null;
  bg: string;
  isVisible?: boolean;
  displayOrder?: number;
}
