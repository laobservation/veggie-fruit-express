
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
import { useToast } from '@/hooks/use-toast';
import MediaPreview from '../MediaPreview';

interface SlideFormProps {
  currentSlide: SlideFormData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: () => void;
  onCancel: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({
  currentSlide,
  isEditing,
  handleInputChange,
  handleSelectChange,
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
    { name: 'Left', value: 'left' },
    { name: 'Center', value: 'center' },
    { name: 'Right', value: 'right' }
  ];
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={currentSlide.title}
          onChange={handleInputChange}
          placeholder="Slide Title"
        />
        <p className="text-xs text-gray-500">Used for admin reference (not displayed on slider)</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={currentSlide.image}
          onChange={handleInputChange}
          placeholder="/images/your-image.jpg"
        />
        <p className="text-xs text-gray-500">Enter the path to an image (e.g., /images/fruit-banner.jpg)</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="color">Background Color</Label>
        <Select
          value={currentSlide.color}
          onValueChange={(value) => handleSelectChange('color', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a color" />
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
      
      <div className="grid gap-2">
        <Label htmlFor="position">Content Position</Label>
        <Select
          value={currentSlide.position}
          onValueChange={(value) => handleSelectChange('position', value as 'left' | 'right' | 'center')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a position" />
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
        <p className="text-sm font-medium mb-2">Preview:</p>
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
            <span className={`${currentSlide.color} text-white font-bold px-3 py-1 rounded border border-white`}>
              {currentSlide.title || 'Slide Title'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? 'Update' : 'Create'} Slide
        </Button>
      </div>
    </div>
  );
};

export default SlideForm;
