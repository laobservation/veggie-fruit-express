
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
    <div className="bg-green-50 py-8 px-4 rounded-lg my-6">
      <h3 className="text-2xl font-bold text-center mb-4">
        Benefits of {categoryName}
      </h3>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold mb-2 text-green-700">Fresh and Organic</h4>
          <p className="text-gray-600">
            Our {categoryName.toLowerCase()} are freshly harvested and 100% organic, ensuring you get the best quality and nutritional value.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold mb-2 text-green-700">Health Benefits</h4>
          <p className="text-gray-600">
            Enjoy the numerous health benefits of consuming fresh {categoryName.toLowerCase()} as part of your balanced diet.
          </p>
        </div>
      </div>
      {categoryPath && (
        <div className="text-center mt-6">
          <Link 
            to={categoryPath}
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Explore All {categoryName}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryBenefitsSection;
