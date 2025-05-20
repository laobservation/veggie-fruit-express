import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/use-categories';

interface CategoryItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  imageIcon?: string | null;
  bg?: string;
  isVisible?: boolean;
  displayOrder?: number;
}

const CategoryNavigation: React.FC = () => {
  const { categories, loading } = useCategories();

  // Default categories in case data isn't available
  const defaultCategories: CategoryItem[] = [
    { id: 'fruits', name: 'Fruits', path: '/category/fruits', bg: 'bg-red-100' },
    { id: 'vegetables', name: 'Légumes', path: '/category/vegetables', bg: 'bg-green-100' },
    { id: 'packs', name: 'Packs', path: '/category/packs', bg: 'bg-amber-100' },
  ];

  // Process and sort categories from the database
  const processedCategories = React.useMemo(() => {
    if (loading || categories.length === 0) {
      return defaultCategories;
    }

    // Filter out categories that are marked as not visible
    const visibleCategories = categories.filter(cat => cat.isVisible !== false);

    // Map database categories to the format expected by the UI
    return visibleCategories
      .map(category => {
        // Convert database category name to URL-friendly format for the path
        const pathName = category.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '');

        return {
          id: category.id,
          name: category.name,
          path: `/category/${pathName}`,
          imageIcon: category.imageIcon,
          bg: category.bg || 'bg-gray-100', // Use bg from database or default
          isVisible: category.isVisible,
          displayOrder: category.displayOrder
        };
      })
      .sort((a, b) => {
        // Sort by displayOrder if available, otherwise maintain default order
        const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
        const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
        return orderA - orderB;
      });
  }, [categories, loading]);

  // Render skeleton loader during loading
  if (loading) {
    return (
      <div className="overflow-x-auto py-4 flex space-x-3 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex flex-col items-center">
            <div className="rounded-full h-16 w-16 bg-gray-200"></div>
            <div className="h-4 w-20 bg-gray-200 rounded mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <nav className="overflow-x-auto py-4 flex space-x-4 px-4">
      {processedCategories.map((category) => (
        <Link
          key={category.id}
          to={category.path}
          className="flex flex-col items-center min-w-[80px]"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.bg}`}>
            {category.imageIcon ? (
              <img 
                src={category.imageIcon} 
                alt={category.name} 
                className="w-10 h-10 object-contain"
              />
            ) : (
              <span className="text-2xl">🥬</span> // Default icon if none provided
            )}
          </div>
          <span className="mt-1 text-sm font-medium text-center">{category.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default CategoryNavigation;
