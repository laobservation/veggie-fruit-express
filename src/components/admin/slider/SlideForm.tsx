
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slide } from '@/types/slider';
import MediaPreview from '@/components/admin/MediaPreview';

interface SlideFormProps {
  slide: Partial<Slide>;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const SlideForm: React.FC<SlideFormProps> = ({ 
  slide, 
  onChange, 
  onSave, 
  onCancel,
  isEditing = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>(slide.image || '');
  
  // Update image URL and notify parent component
  const handleImageChange = (url: string) => {
    setImageUrl(url);
    onChange('image', url);
  };
  
  const positionOptions = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'center', label: 'Center' }
  ];
  
  const colorOptions = [
    { value: 'bg-red-700', label: 'Red' },
    { value: 'bg-blue-700', label: 'Blue' },
    { value: 'bg-green-700', label: 'Green' },
    { value: 'bg-yellow-700', label: 'Yellow' },
    { value: 'bg-purple-700', label: 'Purple' },
    { value: 'bg-pink-700', label: 'Pink' },
    { value: 'bg-indigo-700', label: 'Indigo' },
    { value: 'bg-gray-700', label: 'Gray' },
    { value: 'bg-black', label: 'Black' },
    { value: 'bg-emerald-800', label: 'Emerald' },
    { value: 'bg-teal-700', label: 'Teal' },
    { value: 'bg-orange-700', label: 'Orange' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={slide.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Slide Title"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="image">Image</Label>
        <MediaPreview 
          mediaType="image"
          imageUrl={imageUrl}
          onSelect={handleImageChange} 
          className="mt-1 h-32 rounded-md"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Select
            value={slide.position || 'left'}
            onValueChange={(value) => onChange('position', value)}
          >
            <SelectTrigger id="position" className="mt-1">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="color">Button Color</Label>
          <Select
            value={slide.color || 'bg-emerald-800'}
            onValueChange={(value) => onChange('color', value)}
          >
            <SelectTrigger id="color" className="mt-1">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${option.value}`}></div>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="callToAction">Call To Action Text</Label>
        <Input
          id="callToAction"
          value={slide.callToAction || 'Shop Now'}
          onChange={(e) => onChange('callToAction', e.target.value)}
          placeholder="Button text"
          className="mt-1"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showButton">Show Button</Label>
          <p className="text-sm text-gray-500">Display call-to-action button on this slide</p>
        </div>
        <Switch
          id="showButton"
          checked={slide.showButton !== false} // Default to true if undefined
          onCheckedChange={(checked) => onChange('showButton', checked)}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" onClick={onSave}>
          {isEditing ? 'Update Slide' : 'Add Slide'}
        </Button>
      </div>
    </div>
  );
};

export default SlideForm;
