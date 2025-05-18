
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBenefitsSectionProps {
  categoryName: string;
  categoryPath?: string;
}

const CategoryBenefitsSection: React.FC<CategoryBenefitsSectionProps> = ({
  categoryName,
  categoryPath
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {categoryPath ? (
          <Link to={categoryPath} className="text-green-600 font-medium hover:underline">
            Catégorie: {categoryName}
          </Link>
        ) : (
          <span className="text-gray-700 font-medium">Catégorie: {categoryName}</span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {/* Benefits can be added here if needed */}
      </div>
    </div>
  );
};

export default CategoryBenefitsSection;
