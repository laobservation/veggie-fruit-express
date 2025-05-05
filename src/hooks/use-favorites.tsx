
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

interface FavoritesState {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      isFavorite: (productId: string) => {
        return get().favorites.some(item => item.id === productId);
      },
      
      toggleFavorite: (product: Product) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some(item => item.id === product.id);
        
        if (isAlreadyFavorite) {
          set({ 
            favorites: favorites.filter(item => item.id !== product.id) 
          });
        } else {
          set({ 
            favorites: [...favorites, product] 
          });
        }
      },
      
      addFavorite: (product: Product) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some(item => item.id === product.id);
        
        if (!isAlreadyFavorite) {
          set({ 
            favorites: [...favorites, product] 
          });
        }
      },
      
      removeFavorite: (productId: string) => {
        const { favorites } = get();
        set({ 
          favorites: favorites.filter(item => item.id !== productId) 
        });
      },
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      // Make sure the data is hydrated as soon as possible
      skipHydration: false,
    }
  )
);
