// hooks/useToastNotifications.ts
import { useEffect } from 'react';
import { useToast } from './use-toast';
import { Resource, Tutor } from '@/interfaces/dashboard.interfaces';

interface UseToastNotificationsProps {
  loading: boolean;
  resources: Resource[];
  tutors: Tutor[];
}

export const useToastNotifications = ({
  loading,
  resources,
  tutors,
}: UseToastNotificationsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (resources.length === 0) {
        toast({
          title: "No resources found",
          description: "Check back later for study materials",
          variant: "default"
        });
      }
      
      if (tutors.length === 0) {
        toast({
          title: "No tutors available",
          description: "No tutors are currently registered",
          variant: "default"
        });
      }
    }
  }, [loading, resources.length, tutors.length, toast]);
};