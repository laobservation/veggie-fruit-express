
import { create } from 'zustand';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Json } from '@/integrations/supabase/types';

interface FavoritesState {
  favorites: Product[];
  isLoading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false, // Changed to false by default
  
  isFavorite: (productId: string) => {
    return get().favorites.some(item => item.id === productId);
  },
  
  toggleFavorite: async (product: Product) => {
    const { favorites } = get();
    const isAlreadyFavorite = favorites.some(item => item.id === product.id);
    
    if (isAlreadyFavorite) {
      await get().removeFavorite(product.id);
    } else {
      await get().addFavorite(product);
    }
  },
  
  addFavorite: async (product: Product) => {
    try {
      const { favorites } = get();
      const isAlreadyFavorite = favorites.some(item => item.id === product.id);
      
      if (!isAlreadyFavorite) {
        // Update local state immediately
        set({ favorites: [...favorites, product] });
        
        // Save to Supabase - here we need to ensure the product is JSON-compatible
        const { error } = await supabase
          .from('favorites')
          .insert({
            product_id: product.id,
            product_data: product as unknown as Json // Cast to Json type
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },
  
  removeFavorite: async (productId: string) => {
    try {
      const { favorites } = get();
      
      // Update local state immediately
      set({ favorites: favorites.filter(item => item.id !== productId) });
      
      // Remove from Supabase
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('product_id', productId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },
  
  clearFavorites: async () => {
    try {
      // Update local state immediately
      set({ favorites: [] });
      
      // Clear from Supabase
      const { error } = await supabase
        .from('favorites')
        .delete()
        .neq('product_id', '');  // Delete all entries
        
      if (error) throw error;
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },
  
  fetchFavorites: async () => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('favorites')
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        // Transform data from Supabase format to our Product format
        const favorites = data.map(item => {
          // Safely cast the product_data back to Product type
          const productData = item.product_data as unknown as Product;
          return productData;
        });
        
        set({ favorites, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      set({ isLoading: false });
    }
  }
}));

// Create a React hook wrapper for the Zustand store
export const useFavorites = () => {
  const store = useFavoritesStore();
  const { toast } = useToast();
  
  // Fetch favorites when the hook is first used
  useEffect(() => {
    store.fetchFavorites();
  }, []);
  
  // Enhanced toggleFavorite with toast notification
  const toggleFavoriteWithToast = async (product: Product) => {
    const isFav = store.isFavorite(product.id);
    await store.toggleFavorite(product);
    
    toast({
      title: isFav ? "Removed from favorites" : "Added to favorites",
      description: isFav ? `${product.name} has been removed from your favorites` : `${product.name} has been added to your favorites`,
      duration: 3000,
    });
  };
  
  return {
    ...store,
    toggleFavorite: toggleFavoriteWithToast
  };
};
