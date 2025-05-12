
export interface Slide {
  id: string;
  title?: string;
  color?: string;
  image: string;
  position?: 'left' | 'right' | 'center';
  order?: number;
  show_button?: boolean;
  call_to_action?: string;
  action_url?: string;
}

export interface SlideFormData {
  id?: string;
  title?: string;
  color?: string;
  image: string;
  position?: 'left' | 'right' | 'center';
  order?: number;
  show_button?: boolean;
  call_to_action?: string;
  action_url?: string;
}
