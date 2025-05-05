
import React from 'react';
import CategoryNavigation from '@/components/CategoryNavigation';

const CategoriesSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Categories</h2>
        <button className="text-gray-500 text-sm">View All</button>
      </div>
      
      <CategoryNavigation />
    </div>
  );
};

export default CategoriesSection;
