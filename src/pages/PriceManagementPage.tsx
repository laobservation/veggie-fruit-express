
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/formatPrice';

const PriceManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [priceChanges, setPriceChanges] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .in('category', ['fruit', 'vegetable'])
        .order('name');
      
      if (error) throw error;
      
      const transformedProducts = data.map(item => ({
        id: item.id.toString(),
        name: item.name || '',
        category: item.category || 'fruit',
        price: item.price || 0,
        image: item.image_url || '',
        description: item.description || '',
        unit: item.unit || 'kg',
        featured: false,
        categoryLink: item.link_to_category || false,
        stock: item.stock || 0
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (productId: string, newPrice: number) => {
    setPriceChanges(prev => ({
      ...prev,
      [productId]: newPrice
    }));
  };

  const saveAllPrices = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(priceChanges).map(([productId, price]) => 
        supabase
          .from('Products')
          .update({ price })
          .eq('id', parseInt(productId))
      );
      
      await Promise.all(updates);
      
      // Update local state
      setProducts(prev => prev.map(product => ({
        ...product,
        price: priceChanges[product.id] !== undefined ? priceChanges[product.id] : product.price
      })));
      
      setPriceChanges({});
      
      toast({
        title: "Succès",
        description: "Les prix ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error saving prices:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des prix.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCurrentPrice = (product: Product) => {
    return priceChanges[product.id] !== undefined ? priceChanges[product.id] : product.price;
  };

  const hasChanges = Object.keys(priceChanges).length > 0;

  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.unit}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Prix actuel</p>
              <p className="font-semibold">{formatPrice(product.price)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                step="0.01"
                value={getCurrentPrice(product)}
                onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value) || 0)}
                className="w-24"
                placeholder="0.00"
              />
              <span className="text-sm text-gray-500">DH</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  const fruitProducts = products.filter(p => p.category === 'fruit');
  const vegetableProducts = products.filter(p => p.category === 'vegetable');

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Prix</h1>
          <p className="text-gray-600 mt-2">Modifiez les prix de vos produits fruits et légumes</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Button 
              onClick={saveAllPrices}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          )}
          <Link to="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="fruits" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fruits">Fruits ({fruitProducts.length})</TabsTrigger>
          <TabsTrigger value="vegetables">Légumes ({vegetableProducts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fruits" className="space-y-4 mt-6">
          {fruitProducts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">Aucun fruit trouvé</p>
              </CardContent>
            </Card>
          ) : (
            fruitProducts.map(renderProductCard)
          )}
        </TabsContent>
        
        <TabsContent value="vegetables" className="space-y-4 mt-6">
          {vegetableProducts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">Aucun légume trouvé</p>
              </CardContent>
            </Card>
          ) : (
            vegetableProducts.map(renderProductCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PriceManagementPage;
