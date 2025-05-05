
import React, { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // This ensures the favorites are loaded from localStorage
    setIsLoaded(true);
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <p>Loading favorites...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        
        {favorites.length === 0 ? (
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
