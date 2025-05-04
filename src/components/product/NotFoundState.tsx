
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFoundState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
        <p className="mb-8">Désolé, nous n'avons pas pu trouver le produit que vous cherchez.</p>
        <Button onClick={() => navigate('/')}>Retour à l'Accueil</Button>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundState;
