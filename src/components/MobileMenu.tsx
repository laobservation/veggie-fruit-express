import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/use-categories';
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose
}) => {
  const {
    categories,
    loading
  } = useCategories();
  return <div className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={onClose}>
      <div className={cn("fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out transform", isOpen ? "translate-x-0" : "-translate-x-full")} onClick={e => e.stopPropagation()}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b rounded-none bg-white px-0 mx-0 py-0 my-[11px]">
            <img src="/lovable-uploads/4c234092-7248-4896-9d9b-9da5909ffbfb.png" alt="Marché Bio Logo" className="h-14 w-auto object-contain mx-auto" />
          </div>
          
          <nav className="flex-grow p-4 py-[6px] px-[21px] bg-white rounded-none overflow-y-auto">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="flex items-center p-2 text-gray-700 hover:bg-lime-100 rounded-lg hover:text-green-600 transition-colors" onClick={onClose}>
                  <Home className="w-5 h-5 mr-3" />
                  <span className="text-base font-bold text-neutral-600">Accueil</span>
                </Link>
              </li>
              
              {/* Category Links */}
              <li className="pt-2">
                <h3 className="font-bold text-sm text-gray-500 px-2 pb-2">Categories</h3>
                <ul className="space-y-2">
                  {loading ? <li className="animate-pulse h-8 bg-gray-100 rounded-lg"></li> : categories.map(category => {
                  const categoryPath = `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`;
                  return <li key={category.id}>
                          <Link to={categoryPath} className="flex items-center p-2 text-gray-700 hover:bg-lime-100 rounded-lg hover:text-green-600 transition-colors" onClick={onClose}>
                            <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${category.background_color.replace("-100", "-200")}`}>
                              {category.image_icon ? <img src={category.image_icon} alt={category.name} className="w-5 h-5 object-contain" onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentNode;
                          if (parent instanceof HTMLElement) {
                            parent.innerHTML = `<span class="text-sm">${category.name.charAt(0)}</span>`;
                          }
                        }} /> : <span className="text-sm">{category.name.charAt(0)}</span>}
                            </div>
                            <span className="font-medium text-neutral-600">{category.name}</span>
                          </Link>
                        </li>;
                })}
                </ul>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t mt-auto">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Marché Bio</p>
          </div>
        </div>
      </div>
    </div>;
};
export default MobileMenu;