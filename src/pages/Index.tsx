
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
      
      {/* Footer - visible on desktop only */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Bottom Navigation - visible on mobile only */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Index;
