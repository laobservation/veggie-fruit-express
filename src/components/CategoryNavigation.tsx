
import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryNavigation: React.FC = () => {
  const categories = [
    { id: 'snacks', name: 'Snacks', icon: '🥪', bg: 'bg-orange-100', path: '/' },
    { id: 'breakfast', name: 'Breakfast', icon: '🍳', bg: 'bg-yellow-100', path: '/' },
    { id: 'drinks', name: 'Drinks', icon: '🥤', bg: 'bg-blue-100', path: '/' },
    { id: 'coffee', name: 'Coffee', icon: '☕', bg: 'bg-amber-100', path: '/' },
    { id: 'canned', name: 'Canned', icon: '🥫', bg: 'bg-pink-100', path: '/' },
    { id: 'fruits', name: 'Fruits', icon: '🍎', bg: 'bg-red-100', path: '/fruits' },
    { id: 'sauce', name: 'Sauce', icon: '🧂', bg: 'bg-orange-100', path: '/' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', bg: 'bg-green-100', path: '/vegetables' },
  ];
  
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 w-full pb-2">
      {categories.map((category) => (
        <Link
          to={category.path}
          key={category.id}
          className="flex flex-col items-center"
        >
          <div className={`${category.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-2`}>
            <span className="text-3xl">{category.icon}</span>
          </div>
          <p className="text-sm text-center text-gray-700">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryNavigation;
