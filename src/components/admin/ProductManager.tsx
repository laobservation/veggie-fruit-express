import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import ProductList from './ProductList';
import { createProduct, updateProduct, fetchProducts, deleteProduct } from '@/services/productService';
// import { validateProductForm, prepareProductData } from '@/services/productServiceUtils';
import { prepareProductData } from '@/services/productServiceUtils'; // only keep prepareProductData
import ProductManagerActions from './ProductManagerActions';
import ProductDialogManager from './ProductDialogManager';

const ProductManager: React.FC = () => {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
  
  useEffect(() => {
    loadProducts();
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Products'
        },
        (payload) => {
          console.log('Products table changed:', payload);
          loadProducts();
        }
      )
      .subscribe();
      
    return () => {
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

  // 🔧 CHANGED SECTION: Removed validation to allow incomplete product forms
  const handleSaveProduct = async (formData: Product, mediaType: 'image' | 'video') => {
    const finalFormData = prepareProductData(formData, mediaType);

    setIsSaving(true);
    try {
      if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, finalFormData);
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès.",
        });
      } else {
        await createProduct(finalFormData);
        toast({
          title: "Succès",
          description: "Le nouveau produit a été ajouté avec succès.",
        });
      }

      setIsDialogOpen(false);
      loadProducts();

    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du produit.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /*
  // 🛑 OLD VERSION WITH VALIDATION
  const handleSaveProduct = async (formData: Product, mediaType: 'image' | 'video') => {
    const validation = validateProductForm(formData, mediaType);
    if (!validation.isValid) {
      toast({
        title: "Erreur",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    const finalFormData = prepareProductData(formData, mediaType);

    setIsSaving(true);
    try {
      if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, finalFormData);
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès.",
        });
      } else {
        await createProduct(finalFormData);
        toast({
          title: "Succès",
          description: "Le nouveau produit a été ajouté avec succès.",
        });
      }

      setIsDialogOpen(false);
      loadProducts();

    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du produit.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  */

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        setAllProducts(allProducts.filter(p => p.id !== productId));
        toast({
          title: "Succès",
          description: "Le produit a été supprimé avec succès.",
        });
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
      <ProductManagerActions onAddProduct={handleAddNewProduct} />
      
      <ProductList 
        products={allProducts}
        isLoading={isLoading}
        onAddProduct={handleAddNewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      
      <ProductDialogManager 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedProduct={selectedProduct}
        emptyProduct={emptyProduct}
        isEditing={isEditing}
        isSaving={isSaving}
        onSaveProduct={handleSaveProduct}
      />
    </div>
  );
};

export default ProductManager;
