
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { transformProductFromSupabase } from '@/services/productService';
import { Product } from '@/types/product';

interface SearchBarProps {
  expanded?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ expanded = false, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);
  
  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Smart search with database query
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          // Search in products table
          const { data, error } = await supabase
            .from('Products')
            .select('*')
            .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
            .limit(10);
          
          if (error) throw error;
          
          // Transform and filter results
          const transformedProducts = data?.map(transformProductFromSupabase) || [];
          setSearchResults(transformedProducts);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    
    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  
  const handleClear = () => {
    setSearchTerm('');
    setShowResults(false);
    document.getElementById('search-input')?.focus();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setSearchTerm('');
    setShowResults(false);
    if (onClose) onClose();
  };
  
  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'fruit': 'Fruit',
      'vegetable': 'Légume',
      'pack': 'Pack',
      'drink': 'Boisson',
      'salade-jus': 'Salade & Jus',
      'légumes': 'Légume',
      'fruits': 'Fruit',
      'légumes préparés': 'Légumes préparés'
    };
    return categoryMap[category.toLowerCase()] || category;
  };
  
  return (
    <div ref={resultsRef} className={cn("relative", expanded ? "w-full" : "")}>
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
              placeholder="Rechercher des produits..."
              className="pr-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleInputFocus}
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
            
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto border">
                {isLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Recherche en cours...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="py-1">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link 
                          to={`/product/${product.id}`}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={handleResultClick}
                        >
                          <div className="h-12 w-12 mr-3 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate">{getCategoryText(product.category)}</p>
                            {product.description && (
                              <p className="text-xs text-gray-400 truncate mt-1">{product.description}</p>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <p className="text-sm font-medium text-green-600">{product.price.toFixed(2)} DH</p>
                            <p className="text-xs text-gray-400">/{product.unit}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Aucun résultat trouvé pour "{searchTerm}"
                  </div>
                )}
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
              Annuler
            </Button>
          )}
        </form>
      )}
    </div>
  );
};

export default SearchBar;
