
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TestimonialManager from '@/components/admin/TestimonialManager';

const AdminTestimonialsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Témoignages Vidéo</h1>
          <p className="text-gray-600 mt-2">Gérez les vidéos témoignages qui s'affichent sur la page d'accueil</p>
        </div>
        <Link to="/admin">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour au Dashboard
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vidéos Témoignages</CardTitle>
          <CardDescription>
            Ajoutez, modifiez ou supprimez les vidéos témoignages. Prenez des liens d'Instagram, Facebook, TikTok ou YouTube.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonialsPage;
