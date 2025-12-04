// hooks/useMatchingTutors.ts
import { useState, useEffect } from 'react';
import { Tutor } from '@/interfaces/tutors.interfaces';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/authContext';

interface TutorMatch {
  tutor: Tutor;
  score: number;
  matchReasons?: string[];
}

interface UseMatchingTutorsReturn {
  matchedTutors: TutorMatch[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMatchingTutors = (): UseMatchingTutorsReturn => {
  const [matchedTutors, setMatchedTutors] = useState<TutorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isLoading:authLoading } = useAuth();

  const fetchMatchedTutors = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (authLoading) {
        // Wait until auth loading is done
        return;
      }

      if (!user) {
        throw new Error('Please log in to use matching feature.');
      }

      const studentId = user.studentId;
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(
        `https://backend-learnbridge.onrender.com/api/matching/match/${studentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch matched tutors: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.matches) {
        setMatchedTutors(data.matches);
        toast({
          title: 'Tutors matched!',
          description: `Found ${data.matches.length} tutors matching your preferences`,
        });
      } else {
        throw new Error(data.message || 'Failed to match tutors');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch matched tutors';
      setError(errorMsg);
      console.error('Matching error:', err);
      toast({
        title: 'Error loading matches',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedTutors();
  }, []);

  return {
    matchedTutors,
    loading,
    error,
    refetch: fetchMatchedTutors,
  };
};
