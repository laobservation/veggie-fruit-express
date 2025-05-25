
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
    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Découvrez nos {categoryName}
        </h2>
        <p className="text-gray-600 mb-6">
          Des produits frais et de qualité, soigneusement sélectionnés pour vous offrir le meilleur de la nature.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Produits frais</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Livraison rapide</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Qualité garantie</span>
          </div>
        </div>
        {categoryPath && (
          <div className="mt-6">
            <Link 
              to={categoryPath} 
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Voir toute la catégorie
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBenefitsSection;
