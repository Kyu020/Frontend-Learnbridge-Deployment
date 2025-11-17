import { useState, useEffect } from 'react';
import { resourcesService } from '@/services/resources.service';
import { Resource } from '@/interfaces/resources.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseResourcesDataReturn {
  resources: Resource[];
  favorites: Set<string>;
  loading: boolean;
  error: string | null;
  refetchResources: () => void;
  refetchFavorites: () => void;
  addResource: (resource: Resource) => void;
  toggleFavorite: (resourceId: string) => Promise<void>;
  updateResourceFavoriteCount: (resourceId: string, change: number) => void;
}

export const useResourcesData = (): UseResourcesDataReturn => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      const resourcesData = await resourcesService.fetchResources();
      setResources(resourcesData);
      
      if (resourcesData.length === 0) {
        toast({
          title: "No resources found",
          description: "Be the first to upload a resource!",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error loading resources",
        description: "Failed to load resources",
        variant: "destructive"
      });
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoriteIds = await resourcesService.fetchFavorites();
      setFavorites(new Set(favoriteIds));
    } catch (err: any) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchResources(), fetchFavorites()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleFavorite = async (resourceId: string) => {
    try {
      if (favorites.has(resourceId)) {
        await resourcesService.removeFavorite(resourceId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(resourceId);
          return newFavorites;
        });
        updateResourceFavoriteCount(resourceId, -1);
        
        toast({
          title: "Removed from favorites",
          description: "Resource removed from your favorites."
        });
      } else {
        await resourcesService.addFavorite(resourceId);
        setFavorites(prev => new Set(prev).add(resourceId));
        updateResourceFavoriteCount(resourceId, 1);
        
        toast({
          title: "Added to favorites! ❤️",
          description: "Resource added to your favorites.",
        });
      }
    } catch (err: any) {
      if (err.message.includes("Already added to favorites")) {
        setFavorites(prev => new Set(prev).add(resourceId));
        toast({
          title: "Already in favorites",
          description: "This resource is already in your favorites.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update favorites",
          variant: "destructive",
        });
      }
    }
  };

  const updateResourceFavoriteCount = (resourceId: string, change: number) => {
    setResources(prev => prev.map(resource => 
      resource._id === resourceId 
        ? { 
            ...resource, 
            favoriteCount: Math.max(0, (resource.favoriteCount || 0) + change) 
          }
        : resource
    ));
  };

  const addResource = (resource: Resource) => {
    setResources(prev => [...prev, resource]);
  };

  return {
    resources,
    favorites,
    loading,
    error,
    refetchResources: fetchResources,
    refetchFavorites: fetchFavorites,
    addResource,
    toggleFavorite,
    updateResourceFavoriteCount,
  };
};