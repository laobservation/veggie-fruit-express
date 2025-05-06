
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TranslationsManager from '@/components/admin/TranslationsManager';

const AdminTranslationsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Traductions</h1>
        <Link to="/admin">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour au Tableau de Bord
          </Button>
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <TranslationsManager />
      </div>
    </div>
  );
};

export default AdminTranslationsPage;
