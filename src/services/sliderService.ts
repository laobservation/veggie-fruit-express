
import { supabase } from '@/integrations/supabase/client';
import { Slide } from '@/types/slider';

export const fetchSlidesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const mapDatabaseSlidesToFrontend = (dbSlides: any[]): Slide[] => {
  return dbSlides.map(slide => ({
    id: slide.id,
    title: slide.title,
    color: slide.color,
    image: slide.image,
    position: slide.position as 'left' | 'right' | 'center',
    callToAction: slide.call_to_action || 'Acheter maintenant',
    actionUrl: slide.action_url || '/fruits',
    showButton: slide.show_button !== false, // Convert to boolean with default true
    order: slide.order || 0
  }));
};

export const getDefaultSlides = (): Slide[] => {
  return [
    {
      id: '1',
      title: 'FRUITS FRAIS DE PRODUCTEURS LOCAUX',
      color: 'bg-emerald-800',
      image: '/images/fruit-banner.jpg',
      position: 'left',
      callToAction: 'Voir les fruits',
      actionUrl: '/fruits',
      showButton: true,
      order: 0
    },
    {
      id: '2',
      title: 'LÉGUMES BIO LIVRÉS CHEZ VOUS',
      color: 'bg-purple-700',
      image: '/images/vegetable-banner.jpg',
      position: 'center',
      callToAction: 'Voir les légumes',
      actionUrl: '/vegetables',
      showButton: true,
      order: 1
    },
    {
      id: '3',
      title: 'FAITES VOS COURSES AVEC NOUS',
      color: 'bg-teal-700',
      image: '/lovable-uploads/827a5a28-0db3-4c43-90d7-280863c75660.png',
      position: 'right',
      callToAction: 'Acheter maintenant',
      actionUrl: '/fruits',
      showButton: true,
      order: 2
    }
  ];
};

export const addSlideToSupabase = async (slide: Omit<Slide, 'id'>) => {
  // Convert frontend model to database model
  const dbSlide = {
    title: slide.title,
    color: slide.color,
    image: slide.image,
    position: slide.position,
    call_to_action: slide.callToAction,
    action_url: slide.actionUrl,
    show_button: slide.showButton,
    order: slide.order
  };
  
  const { data, error } = await supabase
    .from('slides')
    .insert(dbSlide)
    .select();
  
  if (error) throw error;
  
  return data ? data[0] : null;
};

export const updateSlideInSupabase = async (slide: Slide) => {
  // Convert frontend model to database model
  const dbSlide = {
    id: slide.id,
    title: slide.title,
    color: slide.color,
    image: slide.image,
    position: slide.position,
    call_to_action: slide.callToAction,
    action_url: slide.actionUrl,
    show_button: slide.showButton,
    order: slide.order
  };
  
  const { data, error } = await supabase
    .from('slides')
    .update(dbSlide)
    .eq('id', slide.id)
    .select();
  
  if (error) throw error;
  
  return data ? data[0] : null;
};

export const deleteSlideFromSupabase = async (slideId: string) => {
  const { error } = await supabase
    .from('slides')
    .delete()
    .eq('id', slideId);
  
  if (error) throw error;
  
  return true;
};

export const updateSlideOrdersInSupabase = async (slides: Slide[]) => {
  try {
    // Update each slide in the database
    const updatePromises = slides.map(slide => 
      supabase
        .from('slides')
        .update({ order: slide.order })
        .eq('id', slide.id)
    );
    
    await Promise.all(updatePromises);
    
    return true;
  } catch (error) {
    console.error('Error reordering slides:', error);
    return false;
  }
};
