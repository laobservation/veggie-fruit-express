
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { useProductForm } from '@/hooks/use-product-form';
import ProductDetails from './products/ProductDetails';
import MediaSelector from './products/MediaSelector';
import ProductSeoFields from './products/ProductSeoFields';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductFormProps {
  product: Product;
  isEditing: boolean;
  isSaving?: boolean;
  onSave: (product: Product, mediaType: 'image' | 'video') => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  isEditing, 
  isSaving = false,
  onSave, 
  onCancel 
}) => {
  const {
    formData,
    mediaType,
    setMediaType,
    categories,
    loadingCategories,
    additionalImageUrl,
    setAdditionalImageUrl,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddAdditionalImage,
    handleRemoveAdditionalImage
  } = useProductForm(product);

  const handleSubmit = () => {
    // Parse structured_data if it's a string
    let finalFormData = { ...formData };
    if (typeof formData.structured_data === 'string') {
      try {
        finalFormData.structured_data = JSON.parse(formData.structured_data);
      } catch (error) {
        console.error('Invalid JSON in structured_data:', error);
        finalFormData.structured_data = {};
      }
    }
    
    onSave(finalFormData, mediaType);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Modifier un Produit" : "Ajouter un Nouveau Produit"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="media">Média</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ProductDetails
              name={formData.name}
              price={formData.price}
              stock={formData.stock}
              category={formData.category}
              unit={formData.unit}
              description={formData.description}
              featured={formData.featured}
              categoryLink={formData.categoryLink}
              categories={categories}
              loadingCategories={loadingCategories}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onCheckboxChange={handleCheckboxChange}
            />
          </TabsContent>
          
          <TabsContent value="media">
            <MediaSelector
              mediaType={mediaType}
              setMediaType={setMediaType}
              imageUrl={formData.image}
              videoUrl={formData.videoUrl}
              additionalImages={formData.additionalImages}
              onImageChange={handleInputChange}
              onVideoChange={handleInputChange}
              onAddAdditionalImage={handleAddAdditionalImage}
              onRemoveAdditionalImage={handleRemoveAdditionalImage}
              additionalImageUrl={additionalImageUrl}
              setAdditionalImageUrl={setAdditionalImageUrl}
            />
          </TabsContent>
          
          <TabsContent value="seo">
            <ProductSeoFields
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>
        </Tabs>
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
