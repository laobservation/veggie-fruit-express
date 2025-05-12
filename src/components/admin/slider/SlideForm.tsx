
import React from 'react';
import { Slide, SlideFormData } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleSubmit: () => void;
  onCancel: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({
  currentSlide,
  isEditing,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
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
          value={currentSlide.title || ''}
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

      {/* Call-to-action button options */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show_button"
          checked={currentSlide.show_button !== false}
          onCheckedChange={(checked) => handleCheckboxChange('show_button', !!checked)}
        />
        <Label htmlFor="show_button">Show Call-to-Action Button</Label>
      </div>

      {currentSlide.show_button !== false && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="call_to_action">Button Text</Label>
            <Input
              id="call_to_action"
              name="call_to_action"
              value={currentSlide.call_to_action || 'Shop Now'}
              onChange={handleInputChange}
              placeholder="Shop Now"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="action_url">Button Link</Label>
            <Input
              id="action_url"
              name="action_url"
              value={currentSlide.action_url || ''}
              onChange={handleInputChange}
              placeholder="/category/fruits"
            />
            <p className="text-xs text-gray-500">Enter the URL where users will go when clicking the button</p>
          </div>
        </>
      )}
      
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
            {currentSlide.show_button !== false && (
              <div className="absolute bottom-2 right-2 bg-white text-xs px-2 py-1 rounded">
                {currentSlide.call_to_action || 'Shop Now'}
              </div>
            )}
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
