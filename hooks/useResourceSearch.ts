import { useState, useEffect } from 'react';
import { Resource } from '@/interfaces/resources.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseResourceSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredResources: Resource[];
  clearSearch: () => void;
}

export const useResourceSearch = (resources: Resource[]): UseResourceSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.uploader?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
      
      if (filtered.length === 0 && searchQuery) {
        toast({
          title: "No results found",
          description: `No resources matching "${searchQuery}"`,
          variant: "default"
        });
      }
    }
  }, [searchQuery, resources, toast]);

  const clearSearch = () => {
    setSearchQuery('');
    toast({
      title: "Search cleared",
      description: "Showing all resources",
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredResources,
    clearSearch,
  };
};