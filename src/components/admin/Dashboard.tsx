
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductManager from './ProductManager';
import OrdersManager from './OrdersManager';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Slider Management</CardTitle>
            <CardDescription>Customize your homepage slider</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/slider">
              <Button variant="default" className="w-full">Manage Slider</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>Manage categories, footer, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/settings">
              <Button variant="default" className="w-full">Manage Settings</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>SEO Management</CardTitle>
            <CardDescription>Optimize pages for search engines</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/seo">
              <Button variant="default" className="w-full">Manage SEO</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View site performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
          <OrdersManager />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
          <ProductManager />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
