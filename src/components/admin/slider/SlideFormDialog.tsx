
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

interface SlideFormDialogProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: HeroSlide;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SlideFormDialog: React.FC<SlideFormDialogProps> = ({
  isOpen,
  isEditing,
  formData,
  onFormChange,
  onPositionChange,
  onSave,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
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
              onChange={onFormChange}
              placeholder="/images/hero-image.jpg" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={onFormChange} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="subtitle">Sous-titre</Label>
            <Input 
              id="subtitle" 
              name="subtitle" 
              value={formData.subtitle} 
              onChange={onFormChange} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ctaText">Texte du Bouton</Label>
            <Input 
              id="ctaText" 
              name="ctaText" 
              value={formData.ctaText} 
              onChange={onFormChange} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ctaLink">Lien du Bouton</Label>
            <Input 
              id="ctaLink" 
              name="ctaLink" 
              value={formData.ctaLink} 
              onChange={onFormChange} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="position">Position du Contenu</Label>
            <Select 
              value={formData.position} 
              onValueChange={onPositionChange}
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
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button onClick={onSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlideFormDialog;
