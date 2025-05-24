import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useSettings } from '@/hooks/use-settings';
import { Package, TrendingUp, Users } from 'lucide-react';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topClients: any[];
}

// Export both as named export and default export for better compatibility
export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topClients: []
  });
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch total products
        const { count: productsCount } = await supabase
          .from('Products')
          .select('*', { count: 'exact', head: true });

        // Fetch orders
        const { data: orders } = await supabase
          .from('Orders')
          .select('*')
          .order('created_at', { ascending: false });

        // Calculate total revenue
        const totalRevenue = orders?.reduce((sum, order) => 
          sum + (order.total_amount || 0), 0) || 0;

        // Get recent orders (last 3)
        const recentOrders = (orders || []).slice(0, 3);

        // Create a map of clients and their orders
        const clientMap = new Map();
        
        orders?.forEach(order => {
          if (!order['Client Name']) return;
          
          const clientName = order['Client Name'];
          if (!clientMap.has(clientName)) {
            clientMap.set(clientName, {
              name: clientName,
              orderCount: 0,
              totalSpent: 0
            });
          }
          
          const client = clientMap.get(clientName);
          client.orderCount++;
          client.totalSpent += (order.total_amount || 0);
        });

        // Convert map to array and sort by total spent
        const topClients = Array.from(clientMap.values())
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 3);

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue,
          recentOrders,
          topClients
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up realtime subscriptions for live updates
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Orders' },
        () => fetchDashboardData()
      )
      .subscribe();
      
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'Products' },
        () => fetchDashboardData()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-veggie-primary" />
              Total Products
            </CardTitle>
            <CardDescription>Products in your inventory</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">{stats.totalProducts}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-veggie-primary" />
              Total Orders
            </CardTitle>
            <CardDescription>All time orders</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">{stats.totalOrders}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-veggie-primary" />
              Revenue
            </CardTitle>
            <CardDescription>Total revenue</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats.totalRevenue.toFixed(2)} {settings.currency}
          </CardContent>
        </Card>
      </div>
          
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentOrders.map((order, index) => (
                  <li key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
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
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'New'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent orders</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => document.querySelector('[value="orders"]')?.dispatchEvent(new Event('click'))}>
              View All Orders
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topClients.length > 0 ? (
              <ul className="space-y-4">
                {stats.topClients.map((client, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.orderCount} orders</p>
                    </div>
                    <span className="font-medium">{client.totalSpent.toFixed(2)} {settings.currency}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No client data available</p>
            )}
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
    </div>
  );
};

// Add a default export that references the named export
export default Dashboard;
