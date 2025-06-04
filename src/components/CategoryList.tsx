
import React from 'react';
import CategoryCircles from '@/components/CategoryCircles';

const CategoryList: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Nos Catégories</h2>
      <CategoryCircles />
    </div>
  );
};

export default CategoryList;
