
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  expanded?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ expanded = false, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);
  
  const handleClear = () => {
    setSearchTerm('');
    document.getElementById('search-input')?.focus();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // TODO: Implement actual search functionality
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
