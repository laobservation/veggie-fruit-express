
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
        <h2 className="text-xl font-bold text-gray-800">Catégorie : </h2>
        {categoryPath ? (
          <Link to={categoryPath} className="ml-2 text-xl font-bold text-green-600 hover:underline">
            {categoryName}
          </Link>
        ) : (
          <span className="ml-2 text-xl font-bold text-green-600">{categoryName}</span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M12 2v4M8 4h8" />
              <path d="M8 11v5M16 11v5M12 11v8" />
              <path d="M4 15a2 2 0 0 0 2 2M18 15a2 2 0 0 1-2 2" />
            </svg>
          </div>
          <h3 className="font-medium text-green-700">Fraîcheur garantie</h3>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
              <path d="M8.5 9A4 4 0 0 1 13 6" />
            </svg>
          </div>
          <h3 className="font-medium text-green-700">Livraison rapide à domicile</h3>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <path d="M12 2L2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 className="font-medium text-green-700">Meilleure qualité</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryBenefitsSection;
