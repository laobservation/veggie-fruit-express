
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  value: string;
}

interface ProductDetailsProps {
  name: string;
  price: number;
  stock?: number;
  category: string;
  unit: string;
  description: string;
  featured: boolean;
  categoryLink?: boolean;
  categories: Category[];
  loadingCategories: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string, field: string) => void;
  onCheckboxChange: (checked: boolean, field: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  name,
  price,
  stock,
  category,
  unit,
  description,
  featured,
  categoryLink = true, // Default to true
  categories,
  loadingCategories,
  onInputChange,
  onSelectChange,
  onCheckboxChange
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Nom du Produit</Label>
        <Input 
          id="name" 
          name="name" 
          value={name} 
          onChange={onInputChange} 
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
            value={category} 
            onValueChange={(value) => onSelectChange(value, 'category')}
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
            value={price} 
            onChange={onInputChange} 
            step="0.01" 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input 
            id="stock" 
            name="stock" 
            type="number" 
            value={stock || 0} 
            onChange={onInputChange} 
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="unit">Unité</Label>
        <Select 
          value={unit} 
          onValueChange={(value) => onSelectChange(value, 'unit')}
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
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="featured" 
          checked={featured} 
          onCheckedChange={(checked) => 
            onCheckboxChange(Boolean(checked), 'featured')
          } 
        />
        <Label htmlFor="featured">Produit Vedette</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="categoryLink" 
          checked={categoryLink} 
          onCheckedChange={(checked) => 
            onCheckboxChange(Boolean(checked), 'categoryLink')
          } 
        />
        <Label htmlFor="categoryLink">Afficher dans la page de Catégorie</Label>
        <div className="text-xs text-gray-500 ml-2">
          (Désactivez cette option uniquement si vous ne voulez pas que ce produit apparaisse sur sa page de catégorie)
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onInputChange}
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Décrivez le produit..."
        />
      </div>
    </>
  );
};

export default ProductDetails;
