
import { create } from 'zustand';
import { Product } from '@/types/product';
import { useEffect } from 'react';

// Local storage key for favorites
const FAVORITES_STORAGE_KEY = 'user_favorites';

interface FavoritesState {
  favorites: Product[];
  isLoading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  getTotalFavorites: () => number;
}

// Helper function to get favorites from localStorage
const getFavoritesFromStorage = (): Product[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error retrieving favorites from localStorage:', error);
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (favorites: Product[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  
  isFavorite: (productId: string) => {
    return get().favorites.some(item => item.id === productId);
  },
  
  getTotalFavorites: () => {
    return get().favorites.length;
  },
  
  toggleFavorite: async (product: Product) => {
    const { favorites } = get();
    const isAlreadyFavorite = favorites.some(item => item.id === product.id);
    
    if (isAlreadyFavorite) {
      await get().removeFavorite(product.id);
    } else {
      await get().addFavorite(product);
    }
    
    // Trigger animation via custom event
    document.dispatchEvent(new CustomEvent('favorites-updated'));
  },
  
  addFavorite: async (product: Product) => {
    try {
      const { favorites } = get();
      const isAlreadyFavorite = favorites.some(item => item.id === product.id);
      
      if (!isAlreadyFavorite) {
        // Update state
        const updatedFavorites = [...favorites, product];
        set({ favorites: updatedFavorites });
        
        // Save to localStorage
        saveFavoritesToStorage(updatedFavorites);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },
  
  removeFavorite: async (productId: string) => {
    try {
      const { favorites } = get();
      
      // Update state
      const updatedFavorites = favorites.filter(item => item.id !== productId);
      set({ favorites: updatedFavorites });
      
      // Save to localStorage
      saveFavoritesToStorage(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },
  
  clearFavorites: async () => {
    try {
      // Update state
      set({ favorites: [] });
      
      // Clear from localStorage
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },
  
  fetchFavorites: async () => {
    try {
      set({ isLoading: true });
      
      // Get from localStorage
      const favorites = getFavoritesFromStorage();
      
      set({ favorites, isLoading: false });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      set({ isLoading: false });
    }
  }
}));

// Create a React hook wrapper for the Zustand store
export const useFavorites = () => {
  const store = useFavoritesStore();
  
  // Fetch favorites when the hook is first used
  useEffect(() => {
    store.fetchFavorites();
  }, []);
  
  return {
    ...store,
  };
};
