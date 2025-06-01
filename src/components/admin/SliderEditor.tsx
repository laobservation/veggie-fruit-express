
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import SliderSpeedControl from './slider/SliderSpeedControl';
import SlidePreview from './slider/SlidePreview';
import SlideFormDialog from './slider/SlideFormDialog';

type SlidePosition = 'left' | 'right' | 'center';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  position: SlidePosition;
}

const SliderEditor: React.FC = () => {
  const { toast } = useToast();
  
  const initialSlides: HeroSlide[] = [
    {
      id: '1',
      image: '/images/hero-1.jpg',
      title: 'Fresh Farm Products',
      subtitle: 'Delivered directly from farm to your door',
      ctaText: 'Shop Now',
      ctaLink: '/fruits',
      position: 'left',
    },
    {
      id: '2',
      image: '/images/hero-2.jpg',
      title: 'Organic Vegetables',
      subtitle: 'Grown naturally without pesticides',
      ctaText: 'Explore',
      ctaLink: '/vegetables',
      position: 'right',
    },
    {
      id: '3',
      image: '/images/hero-3.jpg',
      title: 'Seasonal Fruits',
      subtitle: 'Enjoy the taste of every season',
      ctaText: 'Discover',
      ctaLink: '/fruits',
      position: 'center',
    }
  ];
  
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sliderSpeed, setSliderSpeed] = useState<number[]>([5]);
  
  const emptySlide: HeroSlide = {
    id: '',
    image: '',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '/fruits',
    position: 'center',
  };
  
  const [formData, setFormData] = useState<HeroSlide>(emptySlide);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePositionChange = (value: string) => {
    setFormData({
      ...formData,
      position: value as SlidePosition
    });
  };
  
  const handleAddNewSlide = () => {
    setIsEditing(false);
    setFormData(emptySlide);
    setIsDialogOpen(true);
  };
  
  const handleEditSlide = (slide: HeroSlide) => {
    setIsEditing(true);
    setSelectedSlide(slide);
    setFormData({...slide});
    setIsDialogOpen(true);
  };
  
  const handleSaveSlide = () => {
    if (!formData.title || !formData.subtitle || !formData.image || !formData.ctaText) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditing && selectedSlide) {
      const updatedSlides = slides.map(s => 
        s.id === selectedSlide.id ? { ...formData } : s
      );
      setSlides(updatedSlides);
      toast({
        title: "Succès",
        description: "La diapositive a été mise à jour avec succès.",
      });
    } else {
      const newId = String(Math.max(...slides.map(s => parseInt(s.id))) + 1);
      const newSlide = { ...formData, id: newId };
      setSlides([...slides, newSlide]);
      toast({
        title: "Succès",
        description: "La nouvelle diapositive a été ajoutée avec succès.",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteSlide = (slideId: string) => {
    if (slides.length <= 1) {
      toast({
        title: "Action impossible",
        description: "Vous devez conserver au moins une diapositive.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(updatedSlides);
    toast({
      title: "Supprimé",
      description: "La diapositive a été supprimée avec succès.",
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Éditeur de Slider</h2>
      
      <SliderSpeedControl 
        speed={sliderSpeed}
        onSpeedChange={setSliderSpeed}
      />
      
      <SlidePreview 
        slides={slides}
        onEditSlide={handleEditSlide}
        onDeleteSlide={handleDeleteSlide}
      />
      
      <div className="flex justify-center">
        <Button 
          onClick={handleAddNewSlide}
          className="bg-veggie-primary hover:bg-veggie-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une Diapositive
        </Button>
      </div>
      
      <SlideFormDialog 
        isOpen={isDialogOpen}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleInputChange}
        onPositionChange={handlePositionChange}
        onSave={handleSaveSlide}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default SliderEditor;
