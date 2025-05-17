
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryNavigation from '@/components/CategoryNavigation';

const CategoriesSection: React.FC = () => {
  return (
    <div className="mb-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Categories :</h2>
        <Link to="/category/fruits" className="text-gray-500 text-sm hover:underline">
          View all
        </Link>
      </div>
      
      <CategoryNavigation />
    </div>
  );
};

export default CategoriesSection;
