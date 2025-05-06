
import React from 'react';
import { Slide, SlideFormData } from '@/types/slider';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

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
  onCancel
}) => {
  const colorOptions = [
    { name: 'Emerald Green', value: 'bg-emerald-800' },
    { name: 'Purple', value: 'bg-purple-700' },
    { name: 'Teal', value: 'bg-teal-700' },
    { name: 'Blue', value: 'bg-blue-700' },
    { name: 'Rose', value: 'bg-rose-700' },
    { name: 'Amber', value: 'bg-amber-600' },
    { name: 'Indigo', value: 'bg-indigo-700' }
  ];
  
  const positionOptions = [
    { name: 'Gauche', value: 'left' },
    { name: 'Centre', value: 'center' },
    { name: 'Droite', value: 'right' }
  ];
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          value={currentSlide.title}
          onChange={handleInputChange}
          placeholder="Titre de la diapositive"
        />
        <p className="text-xs text-gray-500">Utilisé comme référence admin (non affiché sur le slider)</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="image">URL de l'image</Label>
        <Input
          id="image"
          name="image"
          value={currentSlide.image}
          onChange={handleInputChange}
          placeholder="/images/votre-image.jpg"
        />
        <p className="text-xs text-gray-500">Entrez le chemin d'une image (ex: /images/fruit-banner.jpg)</p>
      </div>
      
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="showButton">Afficher le bouton d'action</Label>
          <Switch 
            id="showButton" 
            checked={currentSlide.showButton ?? true} 
            onCheckedChange={(checked) => handleSwitchChange('showButton', checked)}
          />
        </div>
      </div>
      
      {(currentSlide.showButton ?? true) && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="callToAction">Texte du bouton</Label>
            <Input
              id="callToAction"
              name="callToAction"
              value={currentSlide.callToAction}
              onChange={handleInputChange}
              placeholder="Acheter maintenant"
            />
            <p className="text-xs text-gray-500">Texte du bouton (ex: 'Acheter', 'En savoir plus')</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="actionUrl">URL du bouton</Label>
            <Input
              id="actionUrl"
              name="actionUrl"
              value={currentSlide.actionUrl || ''}
              onChange={handleInputChange}
              placeholder="/fruits"
            />
            <p className="text-xs text-gray-500">Lien de destination du bouton (ex: /fruits, /legumes)</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="color">Couleur du bouton</Label>
            <Select
              value={currentSlide.color}
              onValueChange={(value) => handleSelectChange('color', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une couleur" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: `var(--${option.value.replace('bg-', '')})` }}
                      ></div>
                      {option.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="position">Position du contenu</Label>
        <Select
          value={currentSlide.position}
          onValueChange={(value) => handleSelectChange('position', value as 'left' | 'right' | 'center')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une position" />
          </SelectTrigger>
          <SelectContent>
            {positionOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-2">
        <p className="text-sm font-medium mb-2">Aperçu:</p>
        <div 
          className="rounded-md h-20 relative overflow-hidden"
          style={{ 
            backgroundImage: currentSlide.image ? `url(${currentSlide.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: !currentSlide.image ? 'gray' : undefined
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {(currentSlide.showButton ?? true) && (
              <span className={`${currentSlide.color} text-white font-bold px-3 py-1 rounded border border-white`}>
                {currentSlide.callToAction || 'Acheter maintenant'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? 'Mettre à jour' : 'Créer'} la diapositive
        </Button>
      </div>
    </div>
  );
};

export default SlideForm;
