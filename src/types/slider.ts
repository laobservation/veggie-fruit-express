
export interface Slide {
  id: string;
  title?: string;
  color?: string;
  image: string;
  position?: 'left' | 'right' | 'center';
  callToAction?: string;
  order?: number;
}

export interface SlideFormData {
  id?: string;
  title?: string;
  color?: string;
  image: string;
  position?: 'left' | 'right' | 'center';
  callToAction?: string;
  order?: number;
}
