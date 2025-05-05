
import React from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, clearFavorites } = useFavorites();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Favorites</h1>
          {favorites.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearFavorites}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 text-green-500 animate-spin mb-4" />
              <p className="text-gray-500">Loading your favorites...</p>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-6">You haven't added any favorites yet</p>
            <Button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-600">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {favorites.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
