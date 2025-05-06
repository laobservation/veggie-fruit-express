
import React, { useState } from 'react';
import { useSlider } from '@/hooks/use-slider';
import { Slide, SlideFormData } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Image } from 'lucide-react';

const SliderManager: React.FC = () => {
  const { slides, loading, fetchSlides, addSlide, updateSlide, deleteSlide } = useSlider();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<SlideFormData>({
    title: '',
    color: 'bg-emerald-800',
    image: '',
    position: 'left',
    callToAction: 'Shop Now'
  });
  const { toast } = useToast();
  
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
  
  const handleAddSlide = () => {
    setIsEditing(false);
    setCurrentSlide({
      title: '',
      color: 'bg-emerald-800',
      image: '',
      position: 'left',
      callToAction: 'Shop Now'
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
  
  const handleSubmit = async () => {
    if (!currentSlide.title || !currentSlide.color) {
      toast({
        title: 'Error',
        description: 'Title and color are required',
        variant: 'destructive'
      });
      return;
    }
    
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
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home Page Slider Management</h2>
        <Button onClick={handleAddSlide} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
      </div>
      
      {slides.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>No slides found. Add a new slide to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slides.map(slide => (
            <Card key={slide.id} className="overflow-hidden">
              <div 
                className="h-[120px] bg-cover bg-center relative" 
                style={{ 
                  backgroundImage: slide.image ? `url(${slide.image})` : undefined,
                  backgroundColor: !slide.image ? slide.color.replace('bg-', '') : undefined 
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`${slide.color} text-white font-bold px-3 py-1 rounded border border-white`}>
                    {slide.callToAction || 'Shop Now'}
                  </span>
                </div>
                {!slide.image && (
                  <div className="absolute bottom-2 right-2 bg-white/70 text-xs px-2 py-1 rounded">
                    No image set
                  </div>
                )}
              </div>
              <CardContent className="pt-4">
                <div className="flex gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    Position: {slide.position || 'left'}
                  </span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: slide.color.includes('bg-') ? 
                      `var(--${slide.color.replace('bg-', '')})` : 
                      slide.color 
                    }}
                  >
                    {slide.color.replace('bg-', '')}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1 truncate">{slide.title}</p>
                <p className="text-sm text-gray-500 truncate">{slide.image || 'No image URL'}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="outline" size="sm" onClick={() => handleEditSlide(slide)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteSlide(slide.id)}
                  disabled={slides.length <= 1}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
          </DialogHeader>
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
              <Label htmlFor="callToAction">Call to Action Text</Label>
              <Input
                id="callToAction"
                name="callToAction"
                value={currentSlide.callToAction}
                onChange={handleInputChange}
                placeholder="Shop Now"
              />
              <p className="text-xs text-gray-500">Text for the button (e.g., 'Shop Now', 'Learn More')</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Button Color</Label>
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
              <Label htmlFor="position">Button Position</Label>
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
                    {currentSlide.callToAction || 'Shop Now'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Create'} Slide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SliderManager;
