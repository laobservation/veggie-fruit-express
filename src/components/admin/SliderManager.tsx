
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
    callToAction: 'Acheter maintenant',
    actionUrl: '/fruits',
    showButton: true
  });
  const { toast } = useToast();
  
  const handleAddSlide = () => {
    setIsEditing(false);
    setCurrentSlide({
      title: '',
      color: 'bg-emerald-800',
      image: '',
      position: 'left',
      callToAction: 'Acheter maintenant',
      actionUrl: '/fruits',
      showButton: true
    });
    setIsDialogOpen(true);
  };
  
  const handleEditSlide = (slide: Slide) => {
    setIsEditing(true);
    setCurrentSlide({ 
      ...slide, 
      showButton: slide.showButton === false ? false : true 
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteSlide = async (slideId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette diapositive?')) {
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
  
  const handleSwitchChange = (name: string, checked: boolean) => {
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
      console.error('Erreur lors de l\'enregistrement de la diapositive:', error);
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
        title: 'Succès',
        description: 'Ordre des diapositives mis à jour',
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation des diapositives:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'ordre des diapositives',
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
        <h2 className="text-2xl font-bold">Gestion du Slider de la Page d'Accueil</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPreview(!showPreview)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
          </Button>
          <Button onClick={handleAddSlide} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une diapositive
          </Button>
        </div>
      </div>
      
      {/* Preview Section */}
      {showPreview && (
        <div className="mb-8 border rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-2 text-sm text-center text-gray-600 border-b">
            Aperçu - Voici comment votre slider apparaîtra sur la page d'accueil
          </div>
          <PromotionSlider customSlides={slides} />
        </div>
      )}
      
      {slides.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Aucune diapositive trouvée. Ajoutez une nouvelle diapositive pour commencer.</p>
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
            <DialogTitle>{isEditing ? 'Modifier la diapositive' : 'Ajouter une nouvelle diapositive'}</DialogTitle>
          </DialogHeader>
          <SlideForm
            currentSlide={currentSlide}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
            handleSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SliderManager;
