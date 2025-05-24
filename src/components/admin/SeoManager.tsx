
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

const SeoManager: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        supabase.from('Products').select('*'),
        supabase.from('categories').select('*')
      ]);

      if (productsData.data) setProducts(productsData.data as Product[]);
      if (categoriesData.data) setCategories(categoriesData.data as Category[]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSeoUpdate = async (productId: string, seoData: any) => {
    try {
      const { error } = await supabase
        .from('Products')
        .update(seoData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "SEO du produit mis à jour avec succès.",
      });

      loadProductsAndCategories();
    } catch (error) {
      console.error('Error updating product SEO:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du SEO.",
        variant: "destructive",
      });
    }
  };

  const handleCategorySeoUpdate = async (categoryId: string, seoData: any) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(seoData)
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "SEO de la catégorie mis à jour avec succès.",
      });

      loadProductsAndCategories();
    } catch (error) {
      console.error('Error updating category SEO:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du SEO.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion SEO</CardTitle>
          <CardDescription>
            Configurez les paramètres SEO pour vos produits et catégories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-select">Sélectionner un produit</Label>
                  <Select onValueChange={(value) => {
                    const product = products.find(p => p.id === value);
                    setSelectedProduct(product || null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un produit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && (
                  <ProductSeoForm 
                    product={selectedProduct} 
                    onSave={handleProductSeoUpdate}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-select">Sélectionner une catégorie</Label>
                  <Select onValueChange={(value) => {
                    const category = categories.find(c => c.id === value);
                    setSelectedCategory(category || null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <CategorySeoForm 
                    category={selectedCategory} 
                    onSave={handleCategorySeoUpdate}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ProductSeoForm: React.FC<{ product: Product; onSave: (id: string, data: any) => void }> = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    meta_keywords: product.meta_keywords || '',
    canonical_url: product.canonical_url || '',
    robots_directives: product.robots_directives || 'index, follow',
    structured_data: JSON.stringify(product.structured_data || {}, null, 2),
    og_title: product.og_title || '',
    og_description: product.og_description || '',
    og_image: product.og_image || '',
    og_url: product.og_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const seoData = {
        ...formData,
        structured_data: JSON.parse(formData.structured_data || '{}')
      };
      onSave(product.id, seoData);
    } catch (error) {
      console.error('Invalid JSON in structured_data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meta_title">Meta Title (max 70 caractères)</Label>
          <Input
            id="meta_title"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            maxLength={70}
          />
        </div>
        <div>
          <Label htmlFor="og_title">Open Graph Title</Label>
          <Input
            id="og_title"
            value={formData.og_title}
            onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meta_description">Meta Description (max 160 caractères)</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            maxLength={160}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="og_description">Open Graph Description</Label>
          <Textarea
            id="og_description"
            value={formData.og_description}
            onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meta_keywords">Meta Keywords (séparés par des virgules)</Label>
          <Input
            id="meta_keywords"
            value={formData.meta_keywords}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="robots_directives">Robots Directives</Label>
          <Select value={formData.robots_directives} onValueChange={(value) => setFormData({ ...formData, robots_directives: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index, follow">index, follow</SelectItem>
              <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
              <SelectItem value="index, nofollow">index, nofollow</SelectItem>
              <SelectItem value="noindex, follow">noindex, follow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="canonical_url">Canonical URL</Label>
          <Input
            id="canonical_url"
            type="url"
            value={formData.canonical_url}
            onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="og_image">Open Graph Image URL</Label>
          <Input
            id="og_image"
            type="url"
            value={formData.og_image}
            onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="og_url">Open Graph URL</Label>
        <Input
          id="og_url"
          type="url"
          value={formData.og_url}
          onChange={(e) => setFormData({ ...formData, og_url: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="structured_data">Structured Data (JSON-LD)</Label>
        <Textarea
          id="structured_data"
          value={formData.structured_data}
          onChange={(e) => setFormData({ ...formData, structured_data: e.target.value })}
          rows={6}
          className="font-mono"
        />
      </div>

      <Button type="submit">Enregistrer les paramètres SEO</Button>
    </form>
  );
};

const CategorySeoForm: React.FC<{ category: Category; onSave: (id: string, data: any) => void }> = ({ category, onSave }) => {
  const [formData, setFormData] = useState({
    meta_title: category.meta_title || '',
    meta_description: category.meta_description || '',
    meta_keywords: category.meta_keywords || '',
    canonical_url: category.canonical_url || '',
    robots_directives: category.robots_directives || 'index, follow',
    structured_data: JSON.stringify(category.structured_data || {}, null, 2),
    og_title: category.og_title || '',
    og_description: category.og_description || '',
    og_image: category.og_image || '',
    og_url: category.og_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const seoData = {
        ...formData,
        structured_data: JSON.parse(formData.structured_data || '{}')
      };
      onSave(category.id, seoData);
    } catch (error) {
      console.error('Invalid JSON in structured_data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Same form structure as ProductSeoForm */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meta_title">Meta Title (max 70 caractères)</Label>
          <Input
            id="meta_title"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            maxLength={70}
          />
        </div>
        <div>
          <Label htmlFor="og_title">Open Graph Title</Label>
          <Input
            id="og_title"
            value={formData.og_title}
            onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meta_description">Meta Description (max 160 caractères)</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            maxLength={160}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="og_description">Open Graph Description</Label>
          <Textarea
            id="og_description"
            value={formData.og_description}
            onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meta_keywords">Meta Keywords (séparés par des virgules)</Label>
          <Input
            id="meta_keywords"
            value={formData.meta_keywords}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="robots_directives">Robots Directives</Label>
          <Select value={formData.robots_directives} onValueChange={(value) => setFormData({ ...formData, robots_directives: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index, follow">index, follow</SelectItem>
              <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
              <SelectItem value="index, nofollow">index, nofollow</SelectItem>
              <SelectItem value="noindex, follow">noindex, follow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="canonical_url">Canonical URL</Label>
          <Input
            id="canonical_url"
            type="url"
            value={formData.canonical_url}
            onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="og_image">Open Graph Image URL</Label>
          <Input
            id="og_image"
            type="url"
            value={formData.og_image}
            onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="og_url">Open Graph URL</Label>
        <Input
          id="og_url"
          type="url"
          value={formData.og_url}
          onChange={(e) => setFormData({ ...formData, og_url: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="structured_data">Structured Data (JSON-LD)</Label>
        <Textarea
          id="structured_data"
          value={formData.structured_data}
          onChange={(e) => setFormData({ ...formData, structured_data: e.target.value })}
          rows={6}
          className="font-mono"
        />
      </div>

      <Button type="submit">Enregistrer les paramètres SEO</Button>
    </form>
  );
};

export default SeoManager;
