
import React, { useState } from 'react';
import { useSlider } from '@/hooks/use-slider';
import { Slide, SlideFormData } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, SlidersHorizontal } from 'lucide-react';
import SlideCard from './slider/SlideCard';
import SlideForm from './slider/SlideForm';
import PromotionSlider from '../home/PromotionSlider';

const SliderManager: React.FC = () => {
  const { slides, loading, addSlide, updateSlide, deleteSlide, reorderSlides } = useSlider();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<SlideFormData>({
    title: '',
    color: 'bg-emerald-800',
    image: '',
    position: 'left',
    show_button: true,
    call_to_action: 'Shop Now',
    action_url: ''
  });
  const { toast } = useToast();
  
  const handleAddSlide = () => {
    setIsEditing(false);
    setCurrentSlide({
      title: '',
      color: 'bg-emerald-800',
      image: '',
      position: 'left',
      show_button: true,
      call_to_action: 'Shop Now',
      action_url: ''
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentSlide({ ...currentSlide, [name]: checked });
  };
  
  const handleSubmit = async () => {
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
  
  const handleMoveSlide = async (slideId: string, direction: 'left' | 'right') => {
    const currentIndex = slides.findIndex(slide => slide.id === slideId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    
    const newSlides = [...slides];
    const slideToMove = newSlides.splice(currentIndex, 1)[0];
    newSlides.splice(newIndex, 0, slideToMove);
    
    try {
      await reorderSlides(newSlides);
      toast({
        title: 'Success',
        description: 'Slide order updated',
      });
    } catch (error) {
      console.error('Error reordering slides:', error);
      toast({
        title: 'Error',
        description: 'Failed to update slide order',
        variant: 'destructive'
      });
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home Page Slider Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPreview(!showPreview)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleAddSlide} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Slide
          </Button>
        </div>
      </div>
      
      {/* Preview Section */}
      {showPreview && (
        <div className="mb-8 border rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-2 text-sm text-center text-gray-600 border-b">
            Preview - This is how your slider will appear on the homepage
          </div>
          <PromotionSlider customSlides={slides} />
        </div>
      )}
      
      {slides.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>No slides found. Add a new slide to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, index) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              onEdit={handleEditSlide}
              onDelete={handleDeleteSlide}
              disableDelete={slides.length <= 1}
              onMoveLeft={(slideId) => handleMoveSlide(slideId, 'left')}
              onMoveRight={(slideId) => handleMoveSlide(slideId, 'right')}
              isFirst={index === 0}
              isLast={index === slides.length - 1}
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
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SliderManager;
