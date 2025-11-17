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
      
      toast({
        title: "Favorites loaded",
        description: `Found ${favoritesData.length} saved item(s)`,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load favorites";
      setError(errorMessage);
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
      
      toast({
        title: "Removing...",
        description: `Removing ${itemType} from favorites`,
      });

      await favoritesService.removeFavorite({ tutorId, resourceId });
      
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav._id !== favoriteId));
      
      toast({
        title: "Removed from favorites",
        description: `The ${itemType} has been removed from your favorites`,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to remove from favorites";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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