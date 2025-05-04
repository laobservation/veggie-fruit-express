import React, { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Plus, Image, Youtube, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';

// Extended Product type
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  unit: string;
  featured: boolean;
  videoUrl?: string;
  categoryLink?: boolean;
  stock?: number;
}

const ProductManager: React.FC = () => {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mediaType, setMediaType<'image' | 'video'>>('image');
  const [isLoading, setIsLoading] = useState(true);
  
  const emptyProduct: Product = {
    id: '',
    name: '',
    category: 'fruit',
    price: 0,
    image: '',
    description: '',
    unit: 'kg',
    featured: false,
    videoUrl: '',
    categoryLink: false,
    stock: 0
  };
  
  const [formData, setFormData] = useState<Product>(emptyProduct);
  
  // Fetch products from Supabase when component mounts
  useEffect(() => {
    loadProducts();

    // Set up a subscription to listen for product changes
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'Products'
        },
        (payload) => {
          console.log('Products table changed:', payload);
          // Refresh the products
          loadProducts();
        }
      )
      .subscribe();
      
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(productsChannel);
    };
  }, []);
  
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch products from Supabase
      const { data, error } = await supabase
        .from('Products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        setAllProducts([]);
        setIsLoading(false);
        return;
      }
      
      // Transform data to match our Product interface
      const transformedProducts = data.map((product: any) => ({
        id: String(product.id),
        name: product.name || '',
        category: product.category || 'fruit',
        price: product.price || 0,
        image: product.image_url || '',
        description: product.description || '',
        unit: product.unit || 'kg',
        featured: product.featured || false,
        videoUrl: product.media_type === 'video' ? product.image_url : '',
        categoryLink: product.link_to_category || false,
        stock: product.stock || 0
      }));
      
      setAllProducts(transformedProducts);
      console.log('Products loaded:', transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
  
  const handleAddNewProduct = () => {
    setIsEditing(false);
    setFormData(emptyProduct);
    setMediaType('image');
    setIsDialogOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({...product});
    setMediaType(product.videoUrl ? 'video' : 'image');
    setIsDialogOpen(true);
  };
  
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate media
    if (mediaType === 'image' && !formData.image) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter une URL d'image.",
        variant: "destructive",
      });
      return;
    }
    
    if (mediaType === 'video' && !formData.videoUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter une URL YouTube.",
        variant: "destructive",
      });
      return;
    }
    
    // If media type is image, clear videoUrl
    const finalFormData = {...formData};
    if (mediaType === 'image') {
      finalFormData.videoUrl = '';
    } else {
      // For video, ensure there's a placeholder image if image is empty
      if (!finalFormData.image) {
        finalFormData.image = '/images/placeholder.svg';
      }
    }
    
    try {
      const productForSupabase = {
        name: finalFormData.name,
        category: finalFormData.category,
        price: finalFormData.price,
        image_url: mediaType === 'image' ? finalFormData.image : finalFormData.videoUrl,
        description: finalFormData.description,
        unit: finalFormData.unit,
        link_to_category: finalFormData.categoryLink,
        media_type: mediaType,
        stock: finalFormData.stock || 0,
        featured: finalFormData.featured || false
      };
      
      if (isEditing && selectedProduct) {
        // Update existing product in Supabase
        const { error } = await supabase
          .from('Products')
          .update(productForSupabase)
          .eq('id', parseInt(selectedProduct.id));
          
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès.",
        });
      } else {
        // Add new product to Supabase
        const { data, error } = await supabase
          .from('Products')
          .insert([productForSupabase])
          .select();
          
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        toast({
          title: "Succès",
          description: "Le nouveau produit a été ajouté avec succès.",
        });
      }
      
      // Close the dialog and reload the products
      setIsDialogOpen(false);
      loadProducts();
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du produit.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const { error } = await supabase
          .from('Products')
          .delete()
          .eq('id', parseInt(productId));
          
        if (error) throw error;
        
        // Remove product from local state
        setAllProducts(allProducts.filter(p => p.id !== productId));
        
        toast({
          title: "Succès",
          description: "Le produit a été supprimé avec succès.",
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression du produit.",
          variant: "destructive",
        });
      }
    }
  };
  
  const renderMediaPreview = () => {
    if (mediaType === 'video' && formData.videoUrl) {
      // Extract video ID from YouTube URL
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = formData.videoUrl.match(youtubeRegex);
      const videoId = match ? match[1] : null;
      
      if (videoId) {
        return (
          <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-4">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${videoId}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        );
      }
    } else if (mediaType === 'image' && formData.image) {
      return (
        <div className="aspect-square w-full rounded overflow-hidden bg-gray-100 mb-4">
          <img 
            src={formData.image} 
            alt="Aperçu du produit" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.svg';
            }}
          />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retourner au Site
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
        <Button onClick={handleAddNewProduct} className="bg-veggie-primary hover:bg-veggie-dark">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Produit
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-veggie-primary"></div>
        </div>
      ) : allProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun produit trouvé. Commencez par ajouter un nouveau produit.</p>
          <Button 
            onClick={handleAddNewProduct}
            className="mt-4 bg-veggie-primary hover:bg-veggie-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Produit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProducts.map(product => (
            <div key={product.id} className="border rounded-md p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="aspect-square overflow-hidden rounded mb-2 bg-gray-100">
                {product.videoUrl ? (
                  // Show a video thumbnail with play button overlay
                  <div className="relative w-full h-full">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-3">
                        <Youtube className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-gray-700 mb-2 text-sm line-clamp-2">{product.description}</p>
              <div className="flex justify-between mt-auto">
                <span className="text-veggie-dark font-bold">{formatPrice(product.price)}</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {product.category === 'fruit' ? 'Fruit' : 'Légume'}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-sm ${product.stock && product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Stock: {product.stock || 0}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Product Dialog */}
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
            
            {renderMediaPreview()}
            
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
              <Label htmlFor="categoryLink">Lier à la Page de Catégorie</Label>
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
