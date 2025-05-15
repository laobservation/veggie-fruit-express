
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';

interface ProductLoadingErrorProps {
  loading: boolean;
}

const ProductLoadingError: React.FC<ProductLoadingErrorProps> = ({ loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse w-full max-w-md h-96 bg-gray-200 rounded-lg"></div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }
  
  // Product not found state
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default ProductLoadingError;
