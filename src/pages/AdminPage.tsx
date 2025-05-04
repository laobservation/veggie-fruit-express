
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Package, 
  ShoppingCart, 
  Users, 
  Ticket, 
  BarChart3, 
  Settings,
  MoreVertical,
  ChevronDown,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// Components for different sections
import ProductManager from '@/components/admin/ProductManager';
import OrdersManager from '@/components/admin/OrdersManager';
import ContentEditor from '@/components/admin/ContentEditor';
import SliderEditor from '@/components/admin/SliderEditor';
import PageManager from '@/components/admin/PageManager';
import LogoManager from '@/components/admin/LogoManager';
import CustomersList from '@/components/admin/CustomersList';
import WebsiteSettings from '@/components/admin/WebsiteSettings';

const chartData = [
  { name: 'Sun', income: 15000, cost: 10000 },
  { name: 'Mon', income: 21000, cost: 14000 },
  { name: 'Tue', income: 18000, cost: 12000 },
  { name: 'Wed', income: 25000, cost: 15000 },
  { name: 'Thu', income: 32000, cost: 18000 },
  { name: 'Fri', income: 24000, cost: 16000 },
  { name: 'Sat', income: 22000, cost: 14000 },
];

const topSellingProducts = [
  { 
    id: '1', 
    name: 'Pommes Bio', 
    orderId: '#1234', 
    stock: 'In Stock', 
    review: 4.9, 
    sold: 123, 
    price: '3.99€'
  },
  { 
    id: '2', 
    name: 'Tomates Cerises', 
    orderId: '#1235', 
    stock: 'Out of Stock', 
    review: 4.8, 
    sold: 98, 
    price: '4.49€'
  },
  { 
    id: '3', 
    name: 'Carottes Bio', 
    orderId: '#1236', 
    stock: 'In Stock', 
    review: 4.7, 
    sold: 75, 
    price: '2.99€'
  },
];

const countryData = [
  { country: 'France', flag: '🇫🇷', amount: '9.16k' },
  { country: 'Belgique', flag: '🇧🇪', amount: '7.12k' },
  { country: 'Espagne', flag: '🇪🇸', amount: '6.13k' },
  { country: 'Italie', flag: '🇮🇹', amount: '5.21k' },
  { country: 'Allemagne', flag: '🇩🇪', amount: '4.18k' },
  { country: 'Suisse', flag: '🇨🇭', amount: '3.17k' },
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    customers: 0,
    revenue: 0,
    orders: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total orders
        const { data: orders, error: ordersError } = await supabase
          .from('Orders')
          .select('id, total_amount');
        
        if (ordersError) throw ordersError;
        
        // Count distinct client names for customer count
        const { count: customerCount, error: customerError } = await supabase
          .from('Orders')
          .select('Client Name', { count: 'exact', head: true })
          .not('Client Name', 'is', null);
        
        if (customerError) throw customerError;
        
        // Calculate total revenue
        const totalRevenue = orders?.reduce((sum, order) => {
          return sum + (order.total_amount || 0);
        }, 0);
        
        setStats({
          customers: customerCount || 0,
          revenue: totalRevenue || 0,
          orders: orders?.length || 0
        });
        
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques",
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, [toast]);

  // Render the appropriate content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Bienvenue sur le tableau de bord</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Clients totaux</p>
                    <h2 className="text-3xl font-bold">{stats.customers.toLocaleString()}</h2>
                    <div className="flex items-center text-xs text-green-600">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      24% depuis la semaine dernière
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Revenu total</p>
                    <h2 className="text-3xl font-bold">{stats.revenue.toLocaleString()}€</h2>
                    <div className="flex items-center text-xs text-red-600">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7L7 17M7 17H16M7 17V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      12% depuis la semaine dernière
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Commandes totales</p>
                    <h2 className="text-3xl font-bold">{stats.orders.toLocaleString()}</h2>
                    <div className="flex items-center text-xs text-green-600">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      32% depuis la semaine dernière
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="col-span-3">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Ventes et Coûts</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-xs">Ventes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-[#A5D7E8]"></div>
                        <span className="text-xs">Coûts</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0891B2" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A5D7E8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#A5D7E8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#888888" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}`} 
                        />
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="cost" 
                          stroke="#A5D7E8" 
                          fillOpacity={1} 
                          fill="url(#colorCost)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="income" 
                          stroke="#0891B2" 
                          fillOpacity={1} 
                          fill="url(#colorIncome)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Top Pays</h3>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {countryData.map((item) => (
                      <div key={item.country} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="text-xl">{item.flag}</div>
                          <span>{item.country}</span>
                        </div>
                        <span className="text-muted-foreground">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Products Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Produits les plus vendus</h3>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Rechercher des produits..." 
                      className="w-64 h-8" 
                      startIcon={<Search className="h-4 w-4" />}
                    />
                    <Select defaultValue="weekly">
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="yearly">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du produit</TableHead>
                      <TableHead>ID commande</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Vendu</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.orderId}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock === 'In Stock' ? 'outline' : 'destructive'} className={cn(
                            product.stock === 'In Stock' ? 'text-green-500 border-green-200 bg-green-50' : ''
                          )}>
                            {product.stock === 'In Stock' ? 'En stock' : 'Épuisé'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {product.review} 
                            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell className="text-right">{product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      case 'products':
        return <ProductManager />;
      case 'orders':
        return <OrdersManager />;
      case 'customers':
        return <CustomersList />;
      case 'content':
        return <ContentEditor />;
      case 'slider':
        return <SliderEditor />;
      case 'pages':
        return <PageManager />;
      case 'logo':
        return <LogoManager />;
      case 'settings':
        return <WebsiteSettings />;
      default:
        return <div>Sélectionnez un élément dans le menu</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white shadow-sm hidden md:block">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<LayoutGrid className="h-5 w-5" />} 
              label="Tableau de bord" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={<Package className="h-5 w-5" />} 
              label="Produits" 
              active={activeTab === 'products'} 
              onClick={() => setActiveTab('products')} 
            />
            <SidebarItem 
              icon={<ShoppingCart className="h-5 w-5" />} 
              label="Commandes" 
              active={activeTab === 'orders'} 
              onClick={() => setActiveTab('orders')} 
            />
            <SidebarItem 
              icon={<Users className="h-5 w-5" />} 
              label="Clients" 
              active={activeTab === 'customers'} 
              onClick={() => setActiveTab('customers')} 
            />
            <SidebarItem 
              icon={<Ticket className="h-5 w-5" />} 
              label="Contenu" 
              active={activeTab === 'content'} 
              onClick={() => setActiveTab('content')} 
            />
            <SidebarItem 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="Slider" 
              active={activeTab === 'slider'} 
              onClick={() => setActiveTab('slider')} 
            />
            <SidebarItem 
              icon={<Settings className="h-5 w-5" />} 
              label="Paramètres" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </nav>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" onClick={() => navigate('/')} className="w-full justify-start">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retour au Site
          </Button>
        </div>
      </div>

      {/* Mobile menu trigger */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button className="rounded-full h-14 w-14 shadow-lg" onClick={() => {
          const mobileSidebar = document.getElementById('mobileSidebar');
          if (mobileSidebar) {
            mobileSidebar.classList.toggle('translate-y-full');
            mobileSidebar.classList.toggle('translate-y-0');
          }
        }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </Button>
      </div>

      {/* Mobile sidebar */}
      <div 
        id="mobileSidebar" 
        className="fixed inset-x-0 bottom-0 z-40 bg-white shadow-lg rounded-t-xl transform translate-y-full transition-transform duration-300 md:hidden"
        style={{ height: "80vh" }}
      >
        <div className="p-4 overflow-y-auto h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem 
              icon={<LayoutGrid className="h-5 w-5" />} 
              label="Tableau de bord" 
              active={activeTab === 'dashboard'} 
              onClick={() => {
                setActiveTab('dashboard');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
            <SidebarItem 
              icon={<Package className="h-5 w-5" />} 
              label="Produits" 
              active={activeTab === 'products'} 
              onClick={() => {
                setActiveTab('products');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
            <SidebarItem 
              icon={<ShoppingCart className="h-5 w-5" />} 
              label="Commandes" 
              active={activeTab === 'orders'} 
              onClick={() => {
                setActiveTab('orders');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
            <SidebarItem 
              icon={<Users className="h-5 w-5" />} 
              label="Clients" 
              active={activeTab === 'customers'} 
              onClick={() => {
                setActiveTab('customers');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
            <SidebarItem 
              icon={<Ticket className="h-5 w-5" />} 
              label="Contenu" 
              active={activeTab === 'content'} 
              onClick={() => {
                setActiveTab('content');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
            <SidebarItem 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="Slider" 
              active={activeTab === 'slider'} 
              onClick={() => {
                setActiveTab('slider');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
            <SidebarItem 
              icon={<Settings className="h-5 w-5" />} 
              label="Paramètres" 
              active={activeTab === 'settings'} 
              onClick={() => {
                setActiveTab('settings');
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar) {
                  mobileSidebar.classList.add('translate-y-full');
                  mobileSidebar.classList.remove('translate-y-0');
                }
              }} 
            />
          </nav>
          
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full justify-start">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retour au Site
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-sm font-medium">{`${payload[0].payload.name}`}</p>
        <p className="text-sm text-blue-600">{`Ventes: ${payload[1]?.value.toLocaleString()}€`}</p>
        <p className="text-sm text-teal-600">{`Coûts: ${payload[0]?.value.toLocaleString()}€`}</p>
      </div>
    );
  }
  return null;
};

// Sidebar item component
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full p-2 rounded-md text-sm font-medium transition-colors",
        active 
          ? "text-white bg-primary" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

export default AdminPage;
