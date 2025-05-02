
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getFeaturedProducts } from '@/data/products';
import Cart from '@/components/Cart';
import { Link } from 'react-router-dom';
import { Fruit, Vegetables, Coffee, Cookie, Home, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <div className="bg-[#f2f7ea] min-h-screen pb-20">
      {/* Header and hero section */}
      <div className="relative bg-gradient-to-r from-[#e3efd8] to-[#65b542] rounded-b-3xl overflow-hidden">
        {/* Top greeting section */}
        <div className="container mx-auto px-4 pt-8 pb-4">
          <h1 className="text-3xl font-bold text-[#143a18]">Hi, Onky Soerya</h1>
        </div>
        
        {/* Health message section with image */}
        <div className="container mx-auto px-4 pb-72 relative">
          <div className="bg-[#4a9c44] text-white p-6 rounded-3xl max-w-xs">
            <h2 className="text-2xl font-bold leading-tight">
              Health starts with eating fruits and vegetables
            </h2>
          </div>
          
          {/* The image positioned to the right */}
          <img 
            src="/lovable-uploads/85df232c-0174-4e86-82c6-7db156adaa06.png" 
            alt="Happy person with fruits" 
            className="absolute right-0 bottom-0 h-[300px] object-contain"
          />
        </div>
        
        {/* Category buttons */}
        <div className="container mx-auto px-4 -mb-16 relative z-10">
          <div className="grid grid-cols-4 gap-2">
            <Link to="/fruits" className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-md w-full aspect-square flex flex-col items-center justify-center">
                <Fruit className="h-8 w-8 text-green-700 mb-2" />
                <span className="text-center text-sm font-medium">Fruits</span>
              </div>
            </Link>
            <Link to="/vegetables" className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-md w-full aspect-square flex flex-col items-center justify-center">
                <Vegetables className="h-8 w-8 text-green-700 mb-2" />
                <span className="text-center text-sm font-medium">Vegetables</span>
              </div>
            </Link>
            <Link to="/drinks" className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-md w-full aspect-square flex flex-col items-center justify-center">
                <Coffee className="h-8 w-8 text-green-700 mb-2" />
                <span className="text-center text-sm font-medium">Drinks</span>
              </div>
            </Link>
            <Link to="/snacks" className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-md w-full aspect-square flex flex-col items-center justify-center">
                <Cookie className="h-8 w-8 text-green-700 mb-2" />
                <span className="text-center text-sm font-medium">Snacks</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Product grid section with the new card style */}
      <div className="container mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-md">
              <div className="flex">
                <div className="w-1/2 pr-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-auto object-contain aspect-square"
                  />
                </div>
                <div className="w-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                    <p className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                  </div>
                  <Button 
                    className="bg-[#4a9c44] hover:bg-[#3a8c34] rounded-full text-white w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic would go here
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-3 px-6 flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center text-green-800">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center text-gray-500">
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-gray-500">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs">Cart</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-500">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
      
      <Cart />
    </div>
  );
};

export default HomePage;
