import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

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
  
  // Initial slides data
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
      // Update existing slide
      const updatedSlides = slides.map(s => 
        s.id === selectedSlide.id ? { ...formData } : s
      );
      setSlides(updatedSlides);
      toast({
        title: "Succès",
        description: "La diapositive a été mise à jour avec succès.",
      });
    } else {
      // Add new slide
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
  
  const handleSliderSpeedChange = (values: number[]) => {
    setSliderSpeed(values);
    toast({
      title: "Vitesse mise à jour",
      description: `La vitesse du slider est maintenant de ${values[0]} secondes.`,
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Éditeur de Slider</h2>
      
      <div className="mb-6 space-y-4">
        <div>
          <Label>Vitesse du slider (secondes)</Label>
          <div className="py-4">
            <Slider 
              defaultValue={[5]} 
              max={10} 
              min={1}
              step={1}
              value={sliderSpeed}
              onValueChange={handleSliderSpeedChange}
            />
          </div>
          <div className="text-center text-sm text-gray-500">
            {sliderSpeed[0]} {sliderSpeed[0] === 1 ? 'seconde' : 'secondes'} par diapositive
          </div>
        </div>
      </div>
      
      <Carousel className="w-full max-w-4xl mx-auto mb-8">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[300px] rounded-xl overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center flex items-center" 
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                  }}
                >
                  <div className={`container mx-auto px-6 h-full flex items-center ${
                    slide.position === 'left' ? 'justify-start' : 
                    slide.position === 'right' ? 'justify-end' : 
                    'justify-center'
                  }`}>
                    <div className="max-w-lg text-center md:text-left bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                      <h1 className="text-2xl font-bold text-white mb-2">{slide.title}</h1>
                      <p className="text-white mb-4">{slide.subtitle}</p>
                      <Button className="bg-veggie-primary hover:bg-veggie-dark text-white">
                        {slide.ctaText}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="bg-white"
                      onClick={() => handleEditSlide(slide)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleDeleteSlide(slide.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Slide {slide.id}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative inline-flex mr-2" />
          <CarouselNext className="relative inline-flex" />
        </div>
      </Carousel>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleAddNewSlide}
          className="bg-veggie-primary hover:bg-veggie-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une Diapositive
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier une Diapositive" : "Ajouter une Nouvelle Diapositive"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image">URL de l'Image</Label>
              <Input 
                id="image" 
                name="image" 
                value={formData.image} 
                onChange={handleInputChange}
                placeholder="/images/hero-image.jpg" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input 
                id="subtitle" 
                name="subtitle" 
                value={formData.subtitle} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ctaText">Texte du Bouton</Label>
              <Input 
                id="ctaText" 
                name="ctaText" 
                value={formData.ctaText} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ctaLink">Lien du Bouton</Label>
              <Input 
                id="ctaLink" 
                name="ctaLink" 
                value={formData.ctaLink} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="position">Position du Contenu</Label>
              <Select 
                value={formData.position} 
                onValueChange={handlePositionChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Gauche</SelectItem>
                  <SelectItem value="center">Centre</SelectItem>
                  <SelectItem value="right">Droite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveSlide}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SliderEditor;
