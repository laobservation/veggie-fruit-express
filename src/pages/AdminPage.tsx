
// Fix the import conflict between Lucide and React Router
import { ArrowLeft, Package, ClipboardList, DollarSign, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProductManager from '@/components/admin/ProductManager';
import OrdersManager from '@/components/admin/OrdersManager';

// Define the AdminPage component
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topClients: []
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // Get total products
        const { count: productsCount } = await supabase
          .from('Products')
          .select('*', { count: 'exact', head: true });
          
        // Get total orders for current month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        const { count: ordersCount } = await supabase
          .from('Orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', firstDayOfMonth.toISOString());
          
        // Get total revenue for current month
        const { data: revenueData } = await supabase
          .from('Orders')
          .select('total_amount')
          .gte('created_at', firstDayOfMonth.toISOString());
          
        const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        
        // Get recent orders
        const { data: recentOrders } = await supabase
          .from('Orders')
          .select('id, created_at, status, total_amount')
          .order('created_at', { ascending: false })
          .limit(3);
          
        // Get top clients (simplified approach)
        const { data: allOrders } = await supabase
          .from('Orders')
          .select('id, "Client Name", total_amount');
          
        // Process client data
        const clientOrderMap = new Map();
        
        allOrders?.forEach(order => {
          const clientName = order['Client Name'];
          if (clientName) {
            if (!clientOrderMap.has(clientName)) {
              clientOrderMap.set(clientName, {
                name: clientName,
                orderCount: 0,
                totalSpent: 0
              });
            }
            
            const client = clientOrderMap.get(clientName);
            client.orderCount += 1;
            client.totalSpent += (order.total_amount || 0);
          }
        });
        
        // Sort clients by total spent and get top 3
        const topClients = Array.from(clientOrderMap.values())
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 3);
          
        // Update dashboard stats
        setDashboardStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          recentOrders: recentOrders || [],
          topClients
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  const formatPrice = (price) => {
    return `${price?.toFixed(2)} DH`;
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Return to Site
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-gray-500" />
                      Total Products
                    </CardTitle>
                    <CardDescription>Products in your inventory</CardDescription>
                  </CardHeader>
                  <CardContent className="text-4xl font-bold">{dashboardStats.totalProducts}</CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-gray-500" />
                      Total Orders
                    </CardTitle>
                    <CardDescription>Orders this month</CardDescription>
                  </CardHeader>
                  <CardContent className="text-4xl font-bold">{dashboardStats.totalOrders}</CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      Revenue
                    </CardTitle>
                    <CardDescription>Revenue this month</CardDescription>
                  </CardHeader>
                  <CardContent className="text-4xl font-bold">{formatPrice(dashboardStats.totalRevenue)}</CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {dashboardStats.recentOrders.length > 0 ? (
                        dashboardStats.recentOrders.map((order, index) => (
                          <li key={order.id} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'New'}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-center py-2">No recent orders</li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>View All Orders</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      Top Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {dashboardStats.topClients.length > 0 ? (
                        dashboardStats.topClients.map((client, index) => (
                          <li key={index} className={`flex justify-between items-center ${
                            index < dashboardStats.topClients.length - 1 ? 'border-b pb-2' : ''
                          }`}>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-gray-500">{client.orderCount} orders</p>
                            </div>
                            <span className="font-medium">{formatPrice(client.totalSpent)}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 text-center py-2">No client data available</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <AlertTitle>Tip: Managing Your Inventory</AlertTitle>
                <AlertDescription>
                  Remember to update your product stock regularly to avoid selling products that are out of stock.
                  You can manage stock levels in the Products tab.
                </AlertDescription>
              </Alert>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="products">
          <ProductManager />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrdersManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add the default export - this is needed for proper importing
export default AdminPage;
