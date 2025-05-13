
// Define the Category interface
export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  imageIcon?: string | null;
  bg: string;
  path?: string;
}

export interface NewCategoryFormData extends Omit<Category, 'id' | 'path'> {
  name: string;
  icon?: string | null;
  imageIcon?: string | null;
  bg: string;
}
