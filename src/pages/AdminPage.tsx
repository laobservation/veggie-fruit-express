
// Fix the import conflict between Lucide and React Router
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase, getProductsTable, getOrdersTable } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProductManager from '@/components/admin/ProductManager';
import OrdersManager from '@/components/admin/OrdersManager';
import CustomersList from '@/components/admin/CustomersList';
import PageManager from '@/components/admin/PageManager';
import ContentEditor from '@/components/admin/ContentEditor';
import SliderEditor from '@/components/admin/SliderEditor';
import LogoManager from '@/components/admin/LogoManager';
import WebsiteSettings from '@/components/admin/WebsiteSettings';

// Define the AdminPage component
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Products</CardTitle>
                <CardDescription>Products in your inventory</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl font-bold">42</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>Orders this month</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl font-bold">18</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Revenue this month</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl font-bold">2,350 DH</CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Order #1092</p>
                      <p className="text-sm text-gray-500">May 2, 2023</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Completed</span>
                  </li>
                  <li className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Order #1091</p>
                      <p className="text-sm text-gray-500">May 1, 2023</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Processing</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #1090</p>
                      <p className="text-sm text-gray-500">April 30, 2023</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Shipped</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>View All Orders</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Mohammed Alami</p>
                      <p className="text-sm text-gray-500">5 orders</p>
                    </div>
                    <span className="font-medium">1,250 DH</span>
                  </li>
                  <li className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Fatima Zahra</p>
                      <p className="text-sm text-gray-500">3 orders</p>
                    </div>
                    <span className="font-medium">820 DH</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Karim Benani</p>
                      <p className="text-sm text-gray-500">2 orders</p>
                    </div>
                    <span className="font-medium">450 DH</span>
                  </li>
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
        </TabsContent>
        
        <TabsContent value="products">
          <ProductManager />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrdersManager />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>Manage basic website information</CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteSettings />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Logo Management</CardTitle>
                <CardDescription>Upload and manage your website logos</CardDescription>
              </CardHeader>
              <CardContent>
                <LogoManager />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Edit your website's main content</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pages">
                <TabsList className="mb-4">
                  <TabsTrigger value="pages">Page Management</TabsTrigger>
                  <TabsTrigger value="content">Content Blocks</TabsTrigger>
                  <TabsTrigger value="slider">Slider Images</TabsTrigger>
                </TabsList>
                <TabsContent value="pages">
                  <PageManager />
                </TabsContent>
                <TabsContent value="content">
                  <ContentEditor />
                </TabsContent>
                <TabsContent value="slider">
                  <SliderEditor />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomersList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add the default export
export default AdminPage;
