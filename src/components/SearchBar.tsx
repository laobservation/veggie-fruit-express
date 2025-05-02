
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  expanded?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ expanded = false, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);
  
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);
  
  const handleClear = () => {
    setSearchTerm('');
    setShowResults(false);
    document.getElementById('search-input')?.focus();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setSearchTerm('');
    setShowResults(false);
    if (onClose) onClose();
  };
  
  return (
    <div className={cn("relative", expanded ? "w-full" : "")}>
      {!isExpanded ? (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsExpanded(true)}
          className="text-gray-700"
        >
          <Search className="h-5 w-5" />
        </Button>
      ) : (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-grow">
            <Input
              id="search-input"
              type="text"
              placeholder="Rechercher..."
              className="pr-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                <ul className="py-1">
                  {searchResults.map((product) => (
                    <li key={product.id}>
                      <Link 
                        to={`/product/${product.id}`}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={handleResultClick}
                      >
                        <div className="h-10 w-10 mr-3 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate">{product.category === 'fruit' ? 'Fruit' : 'Légume'}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {showResults && searchResults.length === 0 && searchTerm.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-50">
                <div className="px-4 py-3 text-sm text-gray-500">
                  Aucun résultat trouvé pour "{searchTerm}"
                </div>
              </div>
            )}
          </div>
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
        </form>
      )}
    </div>
  );
};

export default SearchBar;
