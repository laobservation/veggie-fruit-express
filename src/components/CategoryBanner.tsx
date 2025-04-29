
import { Link } from 'react-router-dom';

interface CategoryBannerProps {
  category: 'fruit' | 'vegetable';
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ category }) => {
  return (
    <div 
      className={`relative h-40 md:h-60 w-full rounded-lg overflow-hidden mb-8 bg-cover bg-center`}
      style={{ backgroundImage: `url('/images/${category}-banner.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {category === 'fruit' ? 'Fresh Fruits' : 'Organic Vegetables'}
        </h2>
        <p className="text-white text-lg md:text-xl mb-4">
          {category === 'fruit' 
            ? 'Sweet and juicy fruits freshly harvested' 
            : 'Farm-fresh vegetables for your healthy diet'}
        </p>
        <Link 
          to={`/${category}s`} 
          className="bg-white text-veggie-primary hover:bg-veggie-primary hover:text-white transition-colors px-6 py-2 rounded-md font-medium"
        >
          Browse All {category === 'fruit' ? 'Fruits' : 'Vegetables'}
        </Link>
      </div>
    </div>
  );
};

export default CategoryBanner;
