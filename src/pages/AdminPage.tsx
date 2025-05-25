import { ArrowLeft, Home, LogOut, Package, Settings, ShoppingBag, Sliders, Search, Grid3X3, Image, Video, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from '@/components/admin/Dashboard';
import ProductManager from '@/components/admin/ProductManager';
import OrdersManager from '@/components/admin/OrdersManager';
import SeoManager from '@/components/admin/SeoManager';
import CategoryManager from '@/components/admin/CategoryManager';
import SliderManager from '@/components/admin/SliderManager';
import WebsiteSettings from '@/components/admin/WebsiteSettings';
import FooterEditor from '@/components/admin/FooterEditor';
import ContentEditor from '@/components/admin/ContentEditor';
import CustomerExperienceManager from '@/components/admin/CustomerExperienceManager';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag },
    { id: 'categories', label: 'Catégories', icon: Grid3X3 },
    { id: 'slider', label: 'Slider', icon: Image },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'footer', label: 'Footer', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'customer-experience', label: 'Expérience Client', icon: Video },
    { id: 'content', label: 'Contenu', icon: Edit },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrdersManager />;
      case 'categories':
        return <CategoryManager />;
      case 'slider':
        return <SliderManager />;
      case 'settings':
        return <WebsiteSettings />;
      case 'footer':
        return <FooterEditor />;
      case 'seo':
        return <SeoManager />;
      case 'customer-experience':
        return <CustomerExperienceManager />;
      case 'content':
        return <ContentEditor />;
      default:
        return <ProductManager />;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'interface d'administration",
    });
    navigate('/');
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex gap-3">
          <Link to="/admin/settings">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Paramètres du site
            </Button>
          </Link>
          <Link to="/admin/slider">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Sliders className="h-4 w-4" />
              Paramètres du Slider
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:bg-red-50 border-red-200"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="products" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="products">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
