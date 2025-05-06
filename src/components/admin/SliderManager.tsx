
import React, { useState } from 'react';
import { useSlider } from '@/hooks/use-slider';
import { Slide, SlideFormData } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import SlideCard from './slider/SlideCard';
import SlideForm from './slider/SlideForm';

const SliderManager: React.FC = () => {
  const { slides, loading, addSlide, updateSlide, deleteSlide } = useSlider();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<SlideFormData>({
    title: '',
    color: 'bg-emerald-800',
    image: '',
    position: 'left',
    callToAction: 'Shop Now'
  });
  const { toast } = useToast();
  
  const handleAddSlide = () => {
    setIsEditing(false);
    setCurrentSlide({
      title: '',
      color: 'bg-emerald-800',
      image: '',
      position: 'left',
      callToAction: 'Shop Now'
    });
    setIsDialogOpen(true);
  };
  
  const handleEditSlide = (slide: Slide) => {
    setIsEditing(true);
    setCurrentSlide({ ...slide });
    setIsDialogOpen(true);
  };
  
  const handleDeleteSlide = async (slideId: string) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      await deleteSlide(slideId);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSlide({ ...currentSlide, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setCurrentSlide({ ...currentSlide, [name]: value });
  };
  
  const handleSubmit = async () => {
    if (!currentSlide.title || !currentSlide.color) {
      toast({
        title: 'Error',
        description: 'Title and color are required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (isEditing) {
        await updateSlide(currentSlide as Slide);
      } else {
        await addSlide(currentSlide);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home Page Slider Management</h2>
        <Button onClick={handleAddSlide} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
      </div>
      
      {slides.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>No slides found. Add a new slide to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slides.map(slide => (
            <SlideCard
              key={slide.id}
              slide={slide}
              onEdit={handleEditSlide}
              onDelete={handleDeleteSlide}
              disableDelete={slides.length <= 1}
            />
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
          </DialogHeader>
          <SlideForm
            currentSlide={currentSlide}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SliderManager;
