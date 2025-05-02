
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from './HomePage';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
