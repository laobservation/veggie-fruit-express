
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManager from '@/components/admin/ProductManager';
import ContentEditor from '@/components/admin/ContentEditor';
import SliderEditor from '@/components/admin/SliderEditor';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Panneau d'Administration</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Site
        </Button>
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="slider">Slider</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="p-4 border rounded-md bg-white">
          <ProductManager />
        </TabsContent>
        <TabsContent value="content" className="p-4 border rounded-md bg-white">
          <ContentEditor />
        </TabsContent>
        <TabsContent value="slider" className="p-4 border rounded-md bg-white">
          <SliderEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
