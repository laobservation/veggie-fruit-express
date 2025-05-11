import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Apple, Carrot, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose
}) => {
  // TODO: Add proper admin check here
  const isAdmin = true; // Placeholder for admin check

  return <div className={cn("fixed inset-0 bg-black/50 z-40 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={onClose}>
      <div className={cn("fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out transform", isOpen ? "translate-x-0" : "-translate-x-full")} onClick={e => e.stopPropagation()}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-veggie-dark">Menu</h2>
          </div>
          
          <nav className="flex-grow p-4">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="flex items-center p-2 text-gray-700 hover:bg-veggie-light rounded-lg hover:text-veggie-primary transition-colors" onClick={onClose}>
                  <Home className="w-5 h-5 mr-3" />
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link to="/fruits" className="flex items-center p-2 text-gray-700 hover:bg-veggie-light rounded-lg hover:text-veggie-primary transition-colors" onClick={onClose}>
                  <Apple className="w-5 h-5 mr-3" />
                  <span>Fruits</span>
                </Link>
              </li>
              <li>
                <Link to="/vegetables" className="flex items-center p-2 text-gray-700 hover:bg-veggie-light rounded-lg hover:text-veggie-primary transition-colors" onClick={onClose}>
                  <Carrot className="w-5 h-5 mr-3" />
                  <span>Légumes</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className="flex items-center p-2 text-gray-700 hover:bg-veggie-light rounded-lg hover:text-veggie-primary transition-colors" onClick={onClose}>
                  <User className="w-5 h-5 mr-3" />
                  <span>Compte</span>
                </Link>
              </li>
              {isAdmin && <li>
                  <Link to="/admin" className="flex items-center p-2 text-gray-700 hover:bg-veggie-light rounded-lg hover:text-veggie-primary transition-colors" onClick={onClose}>
                    <Settings className="w-5 h-5 mr-3" />
                    
                  </Link>
                </li>}
            </ul>
          </nav>
          
          <div className="p-4 border-t mt-auto">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Veggie Express</p>
          </div>
        </div>
      </div>
    </div>;
};
export default MobileMenu;