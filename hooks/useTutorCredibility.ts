// hooks/useTutorCredibility.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TutorCredibility {
  score: number;
  completionRate: string | number;
  sessionsCompleted: number;
  sessionsCancelled: number;
  ratingAverage: number;
  ratingCount: number;
  responseTime: string;
  activeSlots: number;
  lastActiveAt: string;
}

interface UseTutorCredibilityReturn {
  credibility: TutorCredibility | null;
  loading: boolean;
  error: string | null;
  refetch: (tutorId: string) => Promise<void>;
}

export const useTutorCredibility = (): UseTutorCredibilityReturn => {
  const [credibility, setCredibility] = useState<TutorCredibility | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCredibility = async (tutorId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/credibility/tutor/${tutorId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch credibility: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.credibility) {
        setCredibility(data.credibility);
      } else {
        throw new Error(data.message || 'Failed to fetch credibility');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch credibility';
      setError(errorMsg);
      console.error('Credibility error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    credibility,
    loading,
    error,
    refetch: fetchCredibility,
  };
};
