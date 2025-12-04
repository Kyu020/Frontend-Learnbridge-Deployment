// hooks/useTutorSearch.ts
import { useState, useEffect } from 'react';
import { Tutor } from '@/interfaces/tutors.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseTutorSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  filteredTutors: Tutor[];
  clearFilters: () => void;
}

export const useTutorSearch = (tutors: Tutor[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>(tutors);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = tutors.filter((tutor) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.course.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'low' && tutor.hourlyRate >= 200 && tutor.hourlyRate < 400) ||
        (priceRange === 'medium' && tutor.hourlyRate >= 400 && tutor.hourlyRate < 750) ||
        (priceRange === 'high' && tutor.hourlyRate >= 750);
      
      return matchesSearch && matchesPrice;
    });

    setFilteredTutors(filtered);

    // Show search results toast
    if (searchQuery && tutors.length > 0) {
      if (filtered.length === 0) {
        toast({
          title: "No matching tutors",
          description: `No tutors found for "${searchQuery}"`,
        });
      }
    }
  }, [searchQuery, priceRange, tutors, toast]);

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange('all');
    toast({
      title: "Filters cleared",
      description: "Showing all tutors",
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    filteredTutors,
    clearFilters,
  };
};