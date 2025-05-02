
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getFeaturedProducts } from '@/data/products';
import Cart from '@/components/Cart';
import { Link } from 'react-router-dom';
import { Apple, Banana, Coffee, Cookie, Home, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <div className="bg-[#f2f7ea] min-h-screen pb-20">
      {/* Header section with search */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#143a18]">Hi, Onky Soerya</h1>
          <div className="rounded-full bg-white p-2 shadow-sm">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
      
      {/* Health message with kiwi image */}
      <div className="container mx-auto px-4 pb-4">
        <div className="bg-[#CAD15E] text-white p-5 rounded-xl flex items-center justify-between overflow-hidden relative">
          <div className="max-w-[70%]">
            <h2 className="text-lg font-semibold leading-tight text-[#143a18]">
              Health starts with eating fruits and vegetables
            </h2>
            <Button 
              variant="secondary" 
              className="bg-white text-[#143a18] hover:bg-gray-100 rounded-full text-xs mt-2 px-4 py-1 h-auto"
            >
              Read More
            </Button>
          </div>
          <img 
            src="/lovable-uploads/208d16d0-41ea-494a-87f7-ff88315a7932.png" 
            alt="Kiwi fruit" 
            className="absolute right-0 h-full object-cover"
          />
        </div>
      </div>

      {/* Category buttons */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <Link to="/fruits" className="flex flex-col items-center">
            <div className="bg-white py-2 px-4 rounded-lg shadow-sm w-full text-center">
              <span className="flex items-center justify-center">
                <span className="text-green-600 mr-1">🍏</span>
                <span className="text-sm font-medium text-gray-700">Fruits</span>
              </span>
            </div>
          </Link>
          <Link to="/vegetables" className="flex flex-col items-center">
            <div className="bg-white py-2 px-4 rounded-lg shadow-sm w-full text-center">
              <span className="flex items-center justify-center">
                <span className="text-green-600 mr-1">🥬</span>
                <span className="text-sm font-medium text-gray-700">Vegetables</span>
              </span>
            </div>
          </Link>
          <Link to="/drinks" className="flex flex-col items-center">
            <div className="bg-white py-2 px-4 rounded-lg shadow-sm w-full text-center">
              <span className="flex items-center justify-center">
                <span className="text-orange-400 mr-1">🥤</span>
                <span className="text-sm font-medium text-gray-700">Juices</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Product grid section */}
      <div className="container mx-auto px-4 pt-6">
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
