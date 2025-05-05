
import React from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">You haven't added any favorites yet</p>
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
