import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';
import HeroSection from '@/components/HeroSection';
import CategoryList from '@/components/CategoryList';
import { Testimonials } from '@/components/Testimonials';
import { fetchProducts } from '@/lib/data';
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Admin Link for authenticated users */}
      {user && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Accéder à l'administration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <HeroSection />

      <div className="container mx-auto py-12">
        <CategoryList />
      </div>

      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Nos Produits Vedettes</h2>
        <ProductList />
      </div>

      <div className="container mx-auto py-12">
        <Testimonials />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
