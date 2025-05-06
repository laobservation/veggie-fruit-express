
import React, { useState } from 'react';
import { useTranslationsAdmin } from '@/hooks/use-translations';
import { Translation } from '@/types/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  Plus,
  Edit,
  Trash,
  Search,
  Save,
  RefreshCw,
  InfoIcon,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TranslationsManager: React.FC = () => {
  const {
    translations,
    loading,
    saveLoading,
    updateTranslation,
    addTranslation,
    deleteTranslation,
    saveTranslations
  } = useTranslationsAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTranslation, setNewTranslation] = useState<Partial<Translation>>({
    key: '',
    fr: '',
    category: 'general',
    description: ''
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = ['all', 'general', 'navigation', 'product', 'checkout', 'account'];
  
  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = searchTerm.trim() === '' || 
      translation.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      translation.fr.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === 'all' || translation.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSaveTranslations = async () => {
    await saveTranslations(translations);
  };
  
  const handleTranslationChange = (key: string, value: string) => {
    updateTranslation(key, value);
  };
  
  const handleDeleteTranslation = (key: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette traduction?')) {
      deleteTranslation(key);
    }
  };
  
  const handleAddTranslation = () => {
    if (!newTranslation.key || !newTranslation.fr || !newTranslation.category) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (translations.some(t => t.key === newTranslation.key)) {
      alert('Cette clé existe déjà. Veuillez choisir une clé unique.');
      return;
    }
    
    addTranslation({
      key: newTranslation.key,
      fr: newTranslation.fr,
      category: newTranslation.category as 'general' | 'navigation' | 'product' | 'checkout' | 'account',
      description: newTranslation.description
    });
    
    setIsAddDialogOpen(false);
    setNewTranslation({
      key: '',
      fr: '',
      category: 'general',
      description: ''
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Traductions</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleSaveTranslations}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={saveLoading}
          >
            {saveLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer les traductions
              </>
            )}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une traduction
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <Search className="text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher par clé ou valeur..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="flex-1"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Clé</TableHead>
                <TableHead>Valeur (Français)</TableHead>
                <TableHead className="w-[150px]">Catégorie</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTranslations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Aucune traduction trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredTranslations.map(translation => (
                  <TableRow key={translation.key}>
                    <TableCell className="font-mono text-sm">
                      {translation.key}
                      {translation.description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {translation.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={translation.fr}
                        onChange={e => handleTranslationChange(translation.key, e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {translation.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTranslation(translation.key)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle traduction</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                Clé*
              </Label>
              <Input
                id="key"
                placeholder="nav.home"
                value={newTranslation.key}
                onChange={e => setNewTranslation({ ...newTranslation, key: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fr" className="text-right">
                Français*
              </Label>
              <Input
                id="fr"
                placeholder="Accueil"
                value={newTranslation.fr}
                onChange={e => setNewTranslation({ ...newTranslation, fr: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Catégorie*
              </Label>
              <Select
                value={newTranslation.category}
                onValueChange={(value) => 
                  setNewTranslation({ 
                    ...newTranslation, 
                    category: value as 'general' | 'navigation' | 'product' | 'checkout' | 'account' 
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                  <SelectItem value="product">Produit</SelectItem>
                  <SelectItem value="checkout">Commande</SelectItem>
                  <SelectItem value="account">Compte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Description optionnelle"
                value={newTranslation.description}
                onChange={e => setNewTranslation({ ...newTranslation, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddTranslation}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TranslationsManager;
