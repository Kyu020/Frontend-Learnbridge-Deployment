import { useState, useEffect } from 'react';
import { favoritesService } from '@/services/favorites.service';
import { FavoriteItem } from '@/interfaces/favorites.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseFavoritesDataReturn {
  favorites: FavoriteItem[];
  favoriteResources: FavoriteItem[];
  favoriteTutors: FavoriteItem[];
  loading: boolean;
  error: string | null;
  refetchFavorites: () => Promise<void>;
  removeFavorite: (favoriteId: string, tutorId?: string, resourceId?: string) => Promise<void>;
}

export const useFavoritesData = (): UseFavoritesDataReturn => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const favoriteResources = favorites.filter(fav => fav.resourceId && fav.resource);
  const favoriteTutors = favorites.filter(fav => fav.tutorId && fav.tutor);

  const fetchFavorites = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const favoritesData = await favoritesService.getFavorites();
      setFavorites(favoritesData);
      
      console.log('Favorites loaded:', favoritesData.length);
      
      // Only show toast if we have favorites
      if (favoritesData.length > 0) {
        toast({
          title: "Favorites loaded",
          description: `Found ${favoritesData.length} saved item(s)`,
          duration: 3000,
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load favorites";
      setError(errorMessage);
      console.error('Error loading favorites:', errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string, tutorId?: string, resourceId?: string): Promise<void> => {
    try {
      const itemType = tutorId ? 'tutor' : 'resource';
      
      console.log('Removing favorite:', { favoriteId, tutorId, resourceId, itemType });
      
      toast({
        title: "Removing...",
        description: `Removing ${itemType} from favorites`,
      });

      // Log what we're sending to the API
      const requestBody = { 
        tutorId: tutorId || undefined, 
        resourceId: resourceId || undefined 
      };
      console.log('Sending to API:', requestBody);
      
      await favoritesService.removeFavorite(requestBody);
      
      // Remove from local state using the favorite record ID
      setFavorites(prev => prev.filter(fav => fav._id !== favoriteId));
      
      toast({
        title: "Removed from favorites",
        description: `The ${itemType} has been removed from your favorites`,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to remove from favorites";
      console.error('Error removing favorite:', { errorMessage, err });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // CRITICAL: Add useEffect to fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []); // Empty dependency array = run once on mount

  return {
    favorites,
    favoriteResources,
    favoriteTutors,
    loading,
    error,
    refetchFavorites: fetchFavorites,
    removeFavorite,
  };
};