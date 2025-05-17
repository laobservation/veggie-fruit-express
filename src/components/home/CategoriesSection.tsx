
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryNavigation from '@/components/CategoryNavigation';

const CategoriesSection: React.FC = () => {
  return (
    <div className="mb-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Categories :</h2>
        <div className="flex gap-2">
          <button className="p-1 rounded-full border border-gray-300 text-gray-600">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1 rounded-full border border-gray-300 text-gray-600">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <CategoryNavigation />
    </div>
  );
};

export default CategoriesSection;
