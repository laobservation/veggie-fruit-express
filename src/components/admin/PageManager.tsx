
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

const PageManager: React.FC = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'About Us',
      slug: '/about',
      content: '<h1>About Our Farm</h1><p>We are dedicated to providing high-quality organic produce...</p>',
      isPublished: true
    },
    {
      id: '2',
      title: 'Delivery Information',
      slug: '/delivery',
      content: '<h1>Delivery Options</h1><p>We deliver to all areas within 30km of our farm...</p>',
      isPublished: true
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  
  const emptyPage: Page = {
    id: '',
    title: '',
    slug: '',
    content: '',
    isPublished: false
  };
  
  const [formData, setFormData] = useState<Page>(emptyPage);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddNewPage = () => {
    setIsEditing(false);
    setFormData(emptyPage);
    setIsDialogOpen(true);
  };
  
  const handleEditPage = (page: Page) => {
    setIsEditing(true);
    setSelectedPage(page);
    setFormData({...page});
    setIsDialogOpen(true);
  };
  
  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(page => page.id !== pageId));
    toast({
      title: "Page supprimée",
      description: "La page a été supprimée avec succès.",
    });
  };
  
  const handleSavePage = () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }
    
    // Format slug if needed
    let slug = formData.slug;
    if (!slug.startsWith('/')) {
      slug = '/' + slug;
    }
    formData.slug = slug;
    
    if (isEditing && selectedPage) {
      // Update existing page
      const updatedPages = pages.map(p => 
        p.id === selectedPage.id ? { ...formData } : p
      );
      setPages(updatedPages);
      toast({
        title: "Succès",
        description: "La page a été mise à jour avec succès.",
      });
    } else {
      // Add new page
      const newId = String(Math.max(...pages.map(p => parseInt(p.id))) + 1);
      const newPage = { ...formData, id: newId, isPublished: true };
      setPages([...pages, newPage]);
      toast({
        title: "Succès",
        description: "La nouvelle page a été ajoutée avec succès.",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const togglePublishStatus = (pageId: string) => {
    const updatedPages = pages.map(page => {
      if (page.id === pageId) {
        return { ...page, isPublished: !page.isPublished };
      }
      return page;
    });
    
    setPages(updatedPages);
    const page = pages.find(p => p.id === pageId);
    
    toast({
      title: page?.isPublished ? "Page dépubliée" : "Page publiée",
      description: `La page "${page?.title}" a été ${page?.isPublished ? "dépubliée" : "publiée"} avec succès.`,
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des Pages</h2>
        <Button onClick={handleAddNewPage} className="bg-veggie-primary hover:bg-veggie-dark">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une Page
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium">{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>
                <span 
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    page.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {page.isPublished ? 'Publié' : 'Brouillon'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => togglePublishStatus(page.id)}
                  >
                    {page.isPublished ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditPage(page)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier une Page" : "Ajouter une Nouvelle Page"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre de la Page</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">URL de la Page</Label>
              <Input 
                id="slug" 
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
                placeholder="/ma-page"
              />
              <p className="text-xs text-gray-500">
                L'URL doit commencer par un / (exemple: /ma-page)
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Contenu de la Page</Label>
              <Textarea 
                id="content" 
                name="content" 
                value={formData.content} 
                onChange={handleInputChange} 
                rows={8} 
                placeholder="<h1>Mon Titre</h1><p>Mon contenu...</p>"
              />
              <p className="text-xs text-gray-500">
                Utilisez du HTML pour formater votre contenu
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSavePage}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageManager;
