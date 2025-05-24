
export interface Category {
  id: string;
  name: string;
  icon?: string;
  image_icon?: string;
  background_color: string;
  display_order?: number;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
  
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
