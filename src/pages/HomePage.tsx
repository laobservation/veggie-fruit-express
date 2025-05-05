
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsWithStock } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { fixProductImportType } from '@/services/productService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getProductsWithStock();
        
        // Fix product types to ensure compatibility
        setProducts(fixProductImportType(products));
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Unable to load products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCategoryClick = (category: string) => {
    if (category === 'fruits') {
      navigate('/fruits');
    } else if (category === 'vegetables') {
      navigate('/vegetables');
    }
  };

  // Featured promotions for the slider
  const promotions = [
    {
      id: 1,
      title: "MEAL PLAN WITH GROCERY STORE",
      color: "bg-emerald-800",
      image: "/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png"
    },
    {
      id: 2,
      title: "MAKING THE MOST OF YOUR GROCERY",
      color: "bg-purple-700",
      image: "/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png"
    },
    {
      id: 3,
      title: "SHOPPING WITH GROCERY STORE",
      color: "bg-teal-700",
      image: "/lovable-uploads/a4732d9c-3513-4646-b357-a64e5ae17c0b.png"
    }
  ];

  // Category icons for the categories section
  const categories = [
    { id: 'snacks', name: 'Snacks', icon: '🥪', bg: 'bg-orange-100' },
    { id: 'breakfast', name: 'Breakfast', icon: '🍳', bg: 'bg-yellow-100' },
    { id: 'drinks', name: 'Drinks', icon: '🥤', bg: 'bg-blue-100' },
    { id: 'coffee', name: 'Coffee', icon: '☕', bg: 'bg-amber-100' },
    { id: 'canned', name: 'Canned', icon: '🥫', bg: 'bg-pink-100' },
    { id: 'fruits', name: 'Fruits', icon: '🍎', bg: 'bg-red-100' },
    { id: 'sauce', name: 'Sauce', icon: '🧂', bg: 'bg-orange-100' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', bg: 'bg-green-100' },
  ];

  return (
    <div className="bg-gray-50 py-4 px-4">
      {/* Promotions Slider */}
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 mb-8">
        {promotions.map((promo) => (
          <div 
            key={promo.id} 
            className={`${promo.color} rounded-xl flex-shrink-0 w-full md:w-1/3 h-48 flex items-center p-6 text-white`}
          >
            <h3 className="text-2xl font-bold max-w-[50%] leading-tight">{promo.title}</h3>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <button className="text-gray-500 text-sm">View All</button>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className={`${category.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-2`}>
                <span className="text-3xl">{category.icon}</span>
              </div>
              <span className="text-sm text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Popular Items</h2>
          <div className="flex gap-2">
            <button className="p-1 rounded-full border border-gray-300 text-gray-600">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1 rounded-full border border-gray-300 text-gray-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            products.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-center mb-3">
                  <img src={product.image} alt={product.name} className="h-28 object-cover" />
                </div>
                <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500 mr-1">{product.unit}</span>
                  <span className="text-sm text-gray-500 mr-1">•</span>
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                </div>
                <button className="absolute bottom-3 right-3 bg-gray-700 rounded-full p-1">
                  <span className="text-white text-xl">+</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* New Arrival Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">New Arrival</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="w-full h-28 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            products.slice(6, 12).map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-center mb-3">
                  <img src={product.image} alt={product.name} className="h-28 object-cover" />
                </div>
                <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500 mr-1">{product.unit}</span>
                  <span className="text-sm text-gray-500 mr-1">•</span>
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                </div>
                <button className="absolute bottom-3 right-3 bg-gray-700 rounded-full p-1">
                  <span className="text-white text-xl">+</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
