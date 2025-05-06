
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WebsiteSettings from '@/components/admin/WebsiteSettings';
import LogoManager from '@/components/admin/LogoManager';
import PageManager from '@/components/admin/PageManager';
import ContentEditor from '@/components/admin/ContentEditor';
import SliderEditor from '@/components/admin/SliderEditor';
import CustomersList from '@/components/admin/CustomersList';
import FooterEditor from '@/components/admin/FooterEditor';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <Link to="/admin">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="general" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Manage basic website information</CardDescription>
            </CardHeader>
            <CardContent>
              <WebsiteSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Management</CardTitle>
              <CardDescription>Upload and manage your website logos</CardDescription>
            </CardHeader>
            <CardContent>
              <LogoManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
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
        </TabsContent>
        
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Management</CardTitle>
              <CardDescription>Customize your website's footer</CardDescription>
            </CardHeader>
            <CardContent>
              <FooterEditor />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
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

export default AdminSettingsPage;
