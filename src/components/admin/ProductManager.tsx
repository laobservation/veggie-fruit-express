
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
import { createProduct, updateProduct, fetchProducts } from '@/services/productService';

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
      const products = await fetchProducts();
      setAllProducts(products);
      console.log('Products loaded:', products);
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
      if (isEditing && selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, {
          ...finalFormData,
          // Ensure media_type is properly set based on the selected type
          videoUrl: mediaType === 'video' ? finalFormData.videoUrl : undefined
        });
        
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès.",
        });
      } else {
        // Add new product
        await createProduct({
          ...finalFormData,
          // Ensure media_type is properly set based on the selected type
          videoUrl: mediaType === 'video' ? finalFormData.videoUrl : undefined
        });
        
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
          
        if (error) {
          console.error('Delete error:', error);
          throw error;
        }
        
        // Remove product from local state
        setAllProducts(allProducts.filter(p => p.id !== productId));
        
        toast({
          title: "Succès",
          description: "Le produit a été supprimé avec succès.",
        });
        
        // Reload products to ensure UI is in sync with database
        loadProducts();
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
