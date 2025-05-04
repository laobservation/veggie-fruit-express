
import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryNavigation: React.FC = () => {
  const categories = [
    { id: 'all', name: 'All', icon: '🛒', color: 'bg-yellow-400', path: '/' },
    { id: 'vegetable', name: 'Veggie', icon: '🥬', color: 'bg-green-100', path: '/vegetables' },
    { id: 'meat', name: 'Meat', icon: '🥩', color: 'bg-red-100', path: '/meats' },
    { id: 'fruit', name: 'Fruits', icon: '🍎', color: 'bg-red-100', path: '/fruits' },
    { id: 'fish', name: 'Fish', icon: '🐟', color: 'bg-blue-100', path: '/fish' },
  ];
  
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <Link
          to={category.path}
          key={category.id}
          className="flex-shrink-0"
        >
          <div className={`flex flex-col items-center`}>
            <div className={`${category.color} rounded-xl w-14 h-14 flex items-center justify-center ${category.id === 'all' ? 'bg-yellow-400' : ''}`}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <p className="text-xs mt-1 text-center">{category.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
