
export interface Slide {
  id: string;
  title: string;
  color: string;
  image: string;
  position?: 'left' | 'right' | 'center';
}

export interface SlideFormData {
  id?: string;
  title: string;
  color: string;
  image: string;
  position?: 'left' | 'right' | 'center';
}
