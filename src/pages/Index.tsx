
import React from 'react';
import Header from '@/components/Header';
import HomePage from './HomePage';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-0 md:px-4">
          <HomePage />
        </div>
      </main>
      
      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Index;
