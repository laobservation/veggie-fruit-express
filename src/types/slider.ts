
export interface Slide {
  id: string;
  title: string;
  color: string;
  image: string;
  position: 'left' | 'right' | 'center';
  callToAction: string;
  showButton: boolean;
  order: number;
}

export interface SlideFormData {
  title: string;
  color: string;
  image: string;
  position: 'left' | 'right' | 'center';
  callToAction: string;
  showButton: boolean;
}
