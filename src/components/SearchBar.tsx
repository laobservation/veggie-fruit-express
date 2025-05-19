
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';

interface SearchBarProps {
  expanded?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ expanded = false, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchFields, setSearchFields] = useState<string[]>(['name', 'description', 'category']);
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
  
  // More specific search function
  const searchProducts = (term: string) => {
    if (term.length < 1) return [];
    
    const lowerTerm = term.toLowerCase();
    const searchWords = lowerTerm.split(' ').filter(word => word.length > 0);
    
    // Advanced search score calculation
    return products
      .map(product => {
        let score = 0;
        let matches = 0;
        
        // Check for exact name match (highest priority)
        if (product.name.toLowerCase() === lowerTerm) {
          score += 100;
          matches++;
        }
        
        // Check each search word against multiple fields
        searchWords.forEach(word => {
          // Name field (high priority)
          if (product.name.toLowerCase().includes(word)) {
            score += 10;
            matches++;
          }
          
          // Category field (medium priority)
          if (product.category.toLowerCase().includes(word)) {
            score += 5;
            matches++;
          }
          
          // Description field (low priority)
          if (product.description.toLowerCase().includes(word)) {
            score += 2;
            matches++;
          }
          
          // Check for price or unit matches
          if (word === String(product.price) || product.unit.toLowerCase().includes(word)) {
            score += 3;
            matches++;
          }
        });
        
        // Boost score if product matches multiple search words
        if (matches > 0) {
          // Calculate percentage of search words matched
          const matchRatio = matches / searchWords.length;
          score *= (1 + matchRatio);
        }
        
        return { product, score, matches };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, 10); // Limit to 10 results
  };
  
  // Update search results as user types
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const results = searchProducts(searchTerm);
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
    if (searchTerm.length >= 1) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setSearchTerm('');
    setShowResults(false);
    if (onClose) onClose();
  };
  
  const handleInputFocus = () => {
    if (searchTerm.length >= 1) {
      setShowResults(true);
    }
  };
  
  // Handle field selection for more specific searches
  const toggleSearchField = (field: string) => {
    setSearchFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
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
        <form onSubmit={handleSearch} className="flex items-center flex-col">
          <div className="relative flex-grow w-full">
            <Input
              id="search-input"
              type="text"
              placeholder="Rechercher..."
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
            
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                <ul className="py-1">
                  {searchResults.map((product) => (
                    <li key={product.id} className="border-b border-gray-100 last:border-none">
                      <Link 
                        to={`/product/${product.id}`}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={handleResultClick}
                      >
                        <div className="h-12 w-12 mr-3 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                              product.category === 'fruit' ? 'bg-orange-100 text-orange-800' : 
                              product.category === 'vegetable' ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {product.category === 'fruit' ? 'Fruit' : 
                               product.category === 'vegetable' ? 'Légume' : 
                               product.category === 'pack' ? 'Pack' : 
                               product.category === 'drink' ? 'Boisson' : 'Autre'}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">({product.unit})</span>
                          </div>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-green-600">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {showResults && searchResults.length === 0 && searchTerm.length >= 1 && (
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
