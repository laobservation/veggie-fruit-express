
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from './HomePage';
import { Home, Heart, ShoppingCart, Wallet, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <HomePage />
      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top flex justify-around py-2 border-t">
        <Link to="/" className="flex flex-col items-center p-2">
          <Home className="h-5 w-5 text-yellow-500" />
          <span className="text-xs text-gray-600 mt-1">Home</span>
        </Link>
        <Link to="/favorites" className="flex flex-col items-center p-2">
          <Heart className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Favorites</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center p-2">
          <ShoppingCart className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Orders</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2">
          <Wallet className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Wallet</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center p-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-600 mt-1">Settings</span>
        </Link>
      </div>
      
      {/* Desktop Footer - Only shown on desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
