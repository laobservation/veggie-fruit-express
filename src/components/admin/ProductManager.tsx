
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const ProductManager: React.FC = () => {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
  
  const handleAddNewProduct = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleSaveProduct = async (formData: Product, mediaType: 'image' | 'video') => {
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
      
      <ProductList 
        products={allProducts}
        isLoading={isLoading}
        onAddProduct={handleAddNewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      
      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <ProductForm 
            product={selectedProduct || emptyProduct}
            isEditing={isEditing}
            onSave={handleSaveProduct}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;
