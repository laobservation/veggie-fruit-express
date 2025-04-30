import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/components/ui/use-toast';
import { Product, products } from '@/data/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Plus } from 'lucide-react';

const ProductManager: React.FC = () => {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const emptyProduct: Product = {
    id: '',
    name: '',
    category: 'fruit',
    price: 0,
    image: '',
    description: '',
    unit: 'kg',
    featured: false
  };
  
  const [formData, setFormData] = useState<Product>(emptyProduct);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
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
  
  const handleAddNewProduct = () => {
    setIsEditing(false);
    setFormData(emptyProduct);
    setIsDialogOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({...product});
    setIsDialogOpen(true);
  };
  
  const handleSaveProduct = () => {
    if (!formData.name || !formData.description || !formData.image || formData.price <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditing && selectedProduct) {
      // Update existing product
      const updatedProducts = allProducts.map(p => 
        p.id === selectedProduct.id ? { ...formData } : p
      );
      setAllProducts(updatedProducts);
      toast({
        title: "Succès",
        description: "Le produit a été mis à jour avec succès.",
      });
    } else {
      // Add new product
      const newId = String(Math.max(...allProducts.map(p => parseInt(p.id))) + 1);
      const newProduct = { ...formData, id: newId };
      setAllProducts([...allProducts, newProduct]);
      toast({
        title: "Succès",
        description: "Le nouveau produit a été ajouté avec succès.",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des Produits</h2>
        <Button onClick={handleAddNewProduct} className="bg-veggie-primary hover:bg-veggie-dark">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Produit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allProducts.map(product => (
          <div key={product.id} className="border rounded-md p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleEditProduct(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="aspect-square overflow-hidden rounded mb-2 bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-gray-700 mb-2 text-sm line-clamp-2">{product.description}</p>
            <div className="flex justify-between mt-auto">
              <span className="text-veggie-dark font-bold">{product.price.toFixed(2)}€</span>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {product.category === 'fruit' ? 'Fruit' : 'Légume'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
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
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange(value, 'category')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="vegetable">Légume</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Prix</Label>
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">URL de l'Image</Label>
              <Input 
                id="image" 
                name="image" 
                value={formData.image} 
                onChange={handleInputChange} 
              />
            </div>
            
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
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveProduct}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;
