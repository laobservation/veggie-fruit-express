
import React, { useEffect } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, clearFavorites, fetchFavorites } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Ensure favorites are loaded when the page mounts
  useEffect(() => {
    // Fetch in the background without showing loading state
    fetchFavorites();
  }, [fetchFavorites]);
  
  const handleClearAll = async () => {
    await clearFavorites();
    toast({
      title: "Favoris effacés",
      description: "Tous les articles ont été supprimés de vos favoris",
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 pb-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes Favoris</h1>
          {favorites.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Tout effacer
            </Button>
          )}
        </div>
        
        {favorites.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-6">Vous n'avez ajouté aucun favori pour le moment</p>
            <Button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-600">
              Parcourir les produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {favorites.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default FavoritesPage;
