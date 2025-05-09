
import { useState, useEffect } from 'react';
import { Slide } from '@/types/slider';
import { useToast } from './use-toast';
import {
  fetchSlidesFromSupabase,
  mapDatabaseSlidesToFrontend,
  getDefaultSlides,
  addSlideToSupabase,
  updateSlideInSupabase,
  deleteSlideFromSupabase,
  updateSlideOrdersInSupabase
} from '@/services/sliderService';

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
      const data = await fetchSlidesFromSupabase();
      
      if (data && data.length > 0) {
        const mappedSlides = mapDatabaseSlidesToFrontend(data);
        setSlides(mappedSlides);
      } else {
        // If no slides exist, use default slides
        setSlides(getDefaultSlides());
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
      // Get the highest order value
      const maxOrder = slides.length > 0 
        ? Math.max(...slides.map(s => s.order || 0)) 
        : -1;
      
      const slideWithOrder = {
        ...slide,
        order: maxOrder + 1
      };
      
      const newDbSlide = await addSlideToSupabase(slideWithOrder);
      
      if (newDbSlide) {
        // Map the returned data back to our frontend model
        const newSlide: Slide = {
          id: newDbSlide.id,
          title: newDbSlide.title,
          color: newDbSlide.color,
          image: newDbSlide.image,
          position: newDbSlide.position as 'left' | 'right' | 'center',
          callToAction: newDbSlide.call_to_action,
          showButton: newDbSlide.show_button !== false,
          order: newDbSlide.order || 0
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
      const updatedDbSlide = await updateSlideInSupabase(slide);
      
      if (updatedDbSlide) {
        // Map the returned data back to our frontend model
        const updatedSlide: Slide = {
          id: updatedDbSlide.id,
          title: updatedDbSlide.title,
          color: updatedDbSlide.color,
          image: updatedDbSlide.image,
          position: updatedDbSlide.position as 'left' | 'right' | 'center',
          callToAction: updatedDbSlide.call_to_action,
          showButton: updatedDbSlide.show_button !== false,
          order: updatedDbSlide.order || 0
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
      await deleteSlideFromSupabase(slideId);
      
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

  const reorderSlides = async (newSlides: Slide[]) => {
    try {
      // Update the order property for each slide
      const updatedSlides = newSlides.map((slide, index) => ({
        ...slide,
        order: index
      }));
      
      const success = await updateSlideOrdersInSupabase(updatedSlides);
      
      if (success) {
        // Update state with new ordered slides
        setSlides(updatedSlides);
      }
      
      return success;
    } catch (error) {
      console.error('Error reordering slides:', error);
      return false;
    }
  };

  return {
    slides,
    loading,
    fetchSlides,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlides
  };
};
