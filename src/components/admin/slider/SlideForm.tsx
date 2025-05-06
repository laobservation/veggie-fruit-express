
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlideFormData } from '@/types/slider';
import { DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SlideFormProps {
  currentSlide: SlideFormData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleSubmit: () => void;
  onCancel: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({
  currentSlide,
  isEditing,
  handleInputChange,
  handleSelectChange,
  handleSwitchChange,
  handleSubmit,
  onCancel,
}) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid items-center gap-4">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={currentSlide.title}
            onChange={handleInputChange}
            placeholder="FRUITS FRAIS DE PRODUCTEURS LOCAUX"
          />
        </div>
        <div className="grid items-center gap-4">
          <Label htmlFor="image">URL de l'image</Label>
          <Input
            id="image"
            name="image"
            value={currentSlide.image}
            onChange={handleInputChange}
            placeholder="/images/fruit-banner.jpg"
          />
        </div>
        <div className="grid items-center gap-4">
          <Label htmlFor="color">Couleur</Label>
          <Select
            value={currentSlide.color}
            onValueChange={(value) => handleSelectChange('color', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une couleur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-emerald-800">Vert émeraude</SelectItem>
              <SelectItem value="bg-green-700">Vert</SelectItem>
              <SelectItem value="bg-teal-700">Vert sarcelle</SelectItem>
              <SelectItem value="bg-purple-700">Violet</SelectItem>
              <SelectItem value="bg-blue-700">Bleu</SelectItem>
              <SelectItem value="bg-red-700">Rouge</SelectItem>
              <SelectItem value="bg-amber-700">Ambre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-center gap-4">
          <Label htmlFor="position">Position du contenu</Label>
          <Select
            value={currentSlide.position}
            onValueChange={(value) => handleSelectChange('position', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Gauche</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="right">Droite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="showButton" className="mr-2">
              Afficher le bouton
            </Label>
          </div>
          <Switch
            id="showButton"
            checked={currentSlide.showButton}
            onCheckedChange={(checked) => handleSwitchChange('showButton', checked)}
          />
        </div>
        
        {currentSlide.showButton && (
          <>
            <div className="grid items-center gap-4">
              <Label htmlFor="callToAction">Texte du bouton</Label>
              <Input
                id="callToAction"
                name="callToAction"
                value={currentSlide.callToAction}
                onChange={handleInputChange}
                placeholder="Acheter maintenant"
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="actionUrl">URL du lien</Label>
              <Input
                id="actionUrl"
                name="actionUrl"
                value={currentSlide.actionUrl}
                onChange={handleInputChange}
                placeholder="/fruits"
              />
            </div>
          </>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? 'Enregistrer les modifications' : 'Ajouter la diapositive'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SlideForm;
