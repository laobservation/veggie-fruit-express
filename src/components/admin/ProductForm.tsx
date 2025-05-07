
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Image, Youtube, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaPreview from './MediaPreview';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormProps {
  product: Product;
  isEditing: boolean;
  isSaving?: boolean;
  onSave: (product: Product, mediaType: 'image' | 'video') => void;
  onCancel: () => void;
}

interface Category {
  id: string;
  name: string;
  value: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  isEditing, 
  isSaving = false,
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Product>(product);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(product.videoUrl ? 'video' : 'image');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();

    // Subscribe to category changes
    const channel = supabase
      .channel('dynamic-categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        value: cat.name.toLowerCase()
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['price', 'stock'].includes(name) ? parseFloat(value) : value
    });
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleCheckboxChange = (checked: boolean, field: string) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  const handleSubmit = () => {
    onSave(formData, mediaType);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Modifier un Produit" : "Ajouter un Nouveau Produit"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom du Produit</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">Catégorie</Label>
          {loadingCategories ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Chargement des catégories...</span>
            </div>
          ) : (
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange(value, 'category')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem 
                    key={category.id} 
                    value={category.value}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Prix (DH)</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              value={formData.price} 
              onChange={handleInputChange} 
              step="0.01" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock</Label>
            <Input 
              id="stock" 
              name="stock" 
              type="number" 
              value={formData.stock || 0} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="unit">Unité</Label>
          <Select 
            value={formData.unit} 
            onValueChange={(value) => handleSelectChange(value, 'unit')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilogramme (kg)</SelectItem>
              <SelectItem value="bunch">Botte</SelectItem>
              <SelectItem value="basket">Panier</SelectItem>
              <SelectItem value="head">Pièce</SelectItem>
              <SelectItem value="bottle">Bouteille</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label>Type de média</Label>
          <Tabs 
            value={mediaType} 
            onValueChange={(value) => setMediaType(value as 'image' | 'video')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                Vidéo YouTube
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="pt-4">
              <div className="grid gap-2">
                <Label htmlFor="image">URL de l'Image</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="video" className="pt-4">
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">URL YouTube</Label>
                <Input 
                  id="videoUrl" 
                  name="videoUrl" 
                  value={formData.videoUrl || ''} 
                  onChange={handleInputChange} 
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500">
                  Coller le lien d'une vidéo YouTube (ex: https://www.youtube.com/watch?v=abcdefghijk)
                </p>
              </div>
              
              <div className="grid gap-2 mt-4">
                <Label htmlFor="image">Image de couverture (optionnelle)</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  placeholder="URL d'une image de couverture"
                />
                <p className="text-xs text-gray-500">
                  Si non spécifiée, une miniature de la vidéo sera utilisée
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <MediaPreview 
          mediaType={mediaType} 
          imageUrl={formData.image} 
          videoUrl={formData.videoUrl}
        />
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            rows={3} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="featured" 
            checked={formData.featured} 
            onCheckedChange={(checked) => 
              handleCheckboxChange(Boolean(checked), 'featured')
            } 
          />
          <Label htmlFor="featured">Produit Vedette</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="categoryLink" 
            checked={formData.categoryLink} 
            onCheckedChange={(checked) => 
              handleCheckboxChange(Boolean(checked), 'categoryLink')
            } 
          />
          <Label htmlFor="categoryLink">Afficher dans la page de Catégorie</Label>
          <p className="text-xs text-gray-500 ml-2">
            (Les produits sélectionnés apparaîtront sur leur page de catégorie respective)
          </p>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ProductForm;
