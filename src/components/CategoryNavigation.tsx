
import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryNavigation: React.FC = () => {
  const categories = [
    { id: 'fruits', name: 'Fruits', icon: '🍎', bg: 'bg-red-100', path: '/fruits' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', bg: 'bg-green-100', path: '/vegetables' },
    { 
      id: 'packs', 
      name: 'Packs', 
      imageIcon: '/lovable-uploads/3e6664d5-ad8b-4a42-8cd9-a740bb96dcd4.png', 
      bg: 'bg-amber-100', 
      path: '/' 
    },
    { id: 'drinks', name: 'Drinks', icon: '🥤', bg: 'bg-blue-100', path: '/' },
  ];
  
  return (
    <div className="grid grid-cols-4 gap-4 w-full pb-2">
      {categories.map((category) => (
        <Link
          to={category.path}
          key={category.id}
          className="flex flex-col items-center"
        >
          <div className={`${category.bg} w-16 h-16 rounded-lg flex items-center justify-center mb-2`}>
            {category.imageIcon ? (
              <img src={category.imageIcon} alt={category.name} className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-3xl">{category.icon}</span>
            )}
          </div>
          <p className="text-sm text-center text-gray-700">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryNavigation;
