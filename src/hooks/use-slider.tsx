
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Slide } from '@/types/slider';
import { useToast } from './use-toast';

export const useSlider = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Map the database columns to our frontend model
        const mappedSlides = data.map(slide => ({
          id: slide.id,
          title: slide.title,
          color: slide.color,
          image: slide.image,
          position: slide.position as 'left' | 'right' | 'center',
          callToAction: slide.call_to_action || 'Shop Now'
        }));
        setSlides(mappedSlides);
      } else {
        // If no slides exist, use default slides
        setSlides([
          {
            id: '1',
            title: 'FRESH FRUITS FROM LOCAL FARMS',
            color: 'bg-emerald-800',
            image: '/images/fruit-banner.jpg',
            position: 'left',
            callToAction: 'Shop Fruits'
          },
          {
            id: '2',
            title: 'ORGANIC VEGETABLES DELIVERED TO YOUR DOOR',
            color: 'bg-purple-700',
            image: '/images/vegetable-banner.jpg',
            position: 'center',
            callToAction: 'Shop Vegetables'
          },
          {
            id: '3',
            title: 'SHOPPING WITH GROCERY STORE',
            color: 'bg-teal-700',
            image: '/lovable-uploads/827a5a28-0db3-4c43-90d7-280863c75660.png',
            position: 'right',
            callToAction: 'Shop Now'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch slides',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addSlide = async (slide: Omit<Slide, 'id'>) => {
    try {
      // Convert frontend model to database model
      const dbSlide = {
        title: slide.title,
        color: slide.color,
        image: slide.image,
        position: slide.position,
        call_to_action: slide.callToAction
      };
      
      const { data, error } = await supabase
        .from('slides')
        .insert([dbSlide])
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Map the returned data back to our frontend model
        const newSlide: Slide = {
          id: data[0].id,
          title: data[0].title,
          color: data[0].color,
          image: data[0].image,
          position: data[0].position as 'left' | 'right' | 'center',
          callToAction: data[0].call_to_action
        };
        
        setSlides([...slides, newSlide]);
        toast({
          title: 'Success',
          description: 'Slide added successfully',
        });
        return true;
      }
    } catch (error) {
      console.error('Error adding slide:', error);
      toast({
        title: 'Error',
        description: 'Failed to add slide',
        variant: 'destructive'
      });
      return false;
    }
    return false;
  };

  const updateSlide = async (slide: Slide) => {
    try {
      // Convert frontend model to database model
      const dbSlide = {
        id: slide.id,
        title: slide.title,
        color: slide.color,
        image: slide.image,
        position: slide.position,
        call_to_action: slide.callToAction
      };
      
      const { data, error } = await supabase
        .from('slides')
        .update(dbSlide)
        .eq('id', slide.id)
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Map the returned data back to our frontend model
        const updatedSlide: Slide = {
          id: data[0].id,
          title: data[0].title,
          color: data[0].color,
          image: data[0].image,
          position: data[0].position as 'left' | 'right' | 'center',
          callToAction: data[0].call_to_action
        };
        
        setSlides(slides.map(s => s.id === slide.id ? updatedSlide : s));
        toast({
          title: 'Success',
          description: 'Slide updated successfully',
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      toast({
        title: 'Error',
        description: 'Failed to update slide',
        variant: 'destructive'
      });
      return false;
    }
    return false;
  };

  const deleteSlide = async (slideId: string) => {
    if (slides.length <= 1) {
      toast({
        title: 'Error',
        description: 'Cannot delete the last slide',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', slideId);
      
      if (error) throw error;
      
      setSlides(slides.filter(s => s.id !== slideId));
      toast({
        title: 'Success',
        description: 'Slide deleted successfully',
      });
      return true;
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete slide',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    slides,
    loading,
    fetchSlides,
    addSlide,
    updateSlide,
    deleteSlide
  };
};
