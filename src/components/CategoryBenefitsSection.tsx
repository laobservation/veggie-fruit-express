
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
    <section className="py-8 px-4 md:px-0">
      <div className="bg-green-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pourquoi choisir nos {categoryName.toLowerCase()} ?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Bio</h3>
            <p className="text-gray-600 text-sm">
              Produits cultivés sans pesticides ni produits chimiques
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Livraison Rapide</h3>
            <p className="text-gray-600 text-sm">
              Livraison le jour même dans toute la ville
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fraîcheur Garantie</h3>
            <p className="text-gray-600 text-sm">
              Produits sélectionnés chaque matin pour leur qualité
            </p>
          </div>
        </div>
        {categoryPath && (
          <div className="text-center mt-6">
            <Link 
              to={categoryPath}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Découvrir tous nos {categoryName.toLowerCase()}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryBenefitsSection;
