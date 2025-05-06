
// Fix the import conflict between Lucide and React Router
import { ArrowLeft, Home, Package, ShoppingBag, Sliders } from 'lucide-react';
import { Link, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase, getProductsTable, getOrdersTable } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProductManager from '@/components/admin/ProductManager';
import OrdersManager from '@/components/admin/OrdersManager';
import { useEffect } from 'react';
import { Dashboard } from '@/components/admin/Dashboard';

// Define the AdminPage component
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/slider">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Sliders className="h-4 w-4" />
              Slider Settings
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Return to Site
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="dashboard">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Dashboard />
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

export default AdminPage;
