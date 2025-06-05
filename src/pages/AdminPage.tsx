
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Settings, BarChart, FileBox, Image, ShoppingCart, DollarSign, Video, LogOut } from 'lucide-react';
import ProductManager from '@/components/admin/ProductManager';
import Dashboard from '@/components/admin/Dashboard';
import OrdersManager from '@/components/admin/OrdersManager';
import SliderManager from '@/components/admin/SliderManager';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    // Clear admin session
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminAuthData');
    localStorage.removeItem('adminAttempts');
    localStorage.removeItem('adminLockoutEnd');
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès"
    });
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Admin Panel</h2>
                  <p className="text-sm text-gray-500 py-[15px]">Gérer votre boutique en ligne</p>
                </div>
                
                <div className="mt-6 grid gap-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-start gap-1 bg-transparent">
                      <TabsTrigger value="dashboard" className="w-full justify-start border-transparent data-[state=active]:border-l-4 border-l-4 data-[state=active]:border-green-600 pl-2 rounded-none text-left">
                        <BarChart className="h-4 w-4 mr-2" />
                        Tableau de bord
                      </TabsTrigger>
                      
                      <TabsTrigger value="orders" className="w-full justify-start border-transparent data-[state=active]:border-l-4 border-l-4 data-[state=active]:border-green-600 pl-2 rounded-none text-left">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Commandes
                      </TabsTrigger>
                      
                      <TabsTrigger value="products" className="w-full justify-start border-transparent data-[state=active]:border-l-4 border-l-4 data-[state=active]:border-green-600 pl-2 rounded-none text-left">
                        <FileBox className="h-4 w-4 mr-2" />
                        Produits
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="border-t my-4" />

                  <Link to="/admin/slider" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                    <Image className="h-4 w-4" />
                    <span>Slider</span>
                  </Link>

                  <Link to="/admin/testimonials" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                    <Video className="h-4 w-4" />
                    <span>Témoignages Vidéo</span>
                  </Link>

                  <Link to="/prix" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                    <DollarSign className="h-4 w-4" />
                    <span>Gestion des Prix</span>
                  </Link>

                  <Link to="/admin/settings" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>

                  <div className="border-t my-4" />

                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full justify-start px-2 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-none"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="dashboard">
                <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
                <Dashboard />
              </TabsContent>

              <TabsContent value="orders">
                <h1 className="text-2xl font-bold mb-4">Commandes</h1>
                <OrdersManager />
              </TabsContent>

              <TabsContent value="products">
                <h1 className="text-2xl font-bold mb-4">Gestion des produits</h1>
                <ProductManager />
              </TabsContent>

              <TabsContent value="slider">
                <h1 className="text-2xl font-bold mb-4">Slider</h1>
                <SliderManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default AdminPage;
