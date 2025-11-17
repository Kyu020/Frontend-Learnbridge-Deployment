// hooks/useTutorsData.ts
import { useState, useEffect } from 'react';
import { tutorsService } from '@/services/tutors.service';
import { Tutor, TutorFormData, ScheduleFormData, UserTutorStatus } from '@/interfaces/tutors.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseTutorsDataReturn {
  tutors: Tutor[];
  favorites: Set<string>;
  userTutorStatus: UserTutorStatus;
  loading: boolean;
  error: string | null;
  refetchTutors: () => Promise<void>;
  refetchFavorites: () => Promise<void>;
  refetchUserStatus: () => Promise<void>;
  toggleTutorMode: (isTutor: boolean) => Promise<void>;
  createTutorProfile: (formData: TutorFormData) => Promise<void>;
  updateTutorProfile: (formData: TutorFormData) => Promise<void>;
  scheduleSession: (scheduleData: ScheduleFormData & { tutorId: string }) => Promise<void>;
  toggleFavorite: (tutorId: string) => Promise<void>;
}

export const useTutorsData = (): UseTutorsDataReturn => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userTutorStatus, setUserTutorStatus] = useState<UserTutorStatus>({
    isTutor: false,
    hasTutorProfile: false,
    userTutorProfile: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTutors = async (): Promise<void> => {
    try {
      const tutorsData = await tutorsService.fetchTutors();
      setTutors(tutorsData);
      
      if (tutorsData.length === 0) {
        toast({
          title: "No tutors found",
          description: "No tutors are currently available",
        });
      } else {
        toast({
          title: "Tutors loaded! 🎓",
          description: `Found ${tutorsData.length} tutors`,
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error loading tutors",
        description: "Failed to load tutor list",
        variant: "destructive"
      });
    }
  };

  const fetchFavorites = async (): Promise<void> => {
    try {
      const favoriteIds = await tutorsService.fetchFavorites();
      setFavorites(new Set(favoriteIds));
    } catch (err: any) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const fetchUserTutorStatus = async (): Promise<void> => {
    try {
      const { tutorProfile } = await tutorsService.verifyTutorProfile();
      setUserTutorStatus({
        isTutor: !!tutorProfile,
        hasTutorProfile: !!tutorProfile,
        userTutorProfile: tutorProfile,
      });
    } catch (err: any) {
      console.error("Failed to fetch user tutor status:", err);
      setUserTutorStatus({
        isTutor: false,
        hasTutorProfile: false,
        userTutorProfile: null,
      });
    }
  };

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchTutors(), fetchFavorites(), fetchUserTutorStatus()]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTutorMode = async (isTutor: boolean): Promise<void> => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        throw new Error("Student ID not found. Please log in again.");
      }

      await tutorsService.toggleTutorMode(studentId, isTutor);
      setUserTutorStatus(prev => ({ ...prev, isTutor }));
      
      toast({
        title: "Success",
        description: `Tutor mode ${isTutor ? "enabled" : "disabled"}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update tutor mode",
        variant: "destructive"
      });
      throw err;
    }
  };

  const createTutorProfile = async (formData: TutorFormData): Promise<void> => {
    try {
      if (!formData.bio || !formData.course || !formData.hourlyRate) {
        throw new Error("Please fill in all required fields.");
      }

      const { tutor } = await tutorsService.createTutorProfile(formData);
      setUserTutorStatus({
        isTutor: true,
        hasTutorProfile: true,
        userTutorProfile: tutor,
      });
      
      await fetchTutors();
      
      toast({ 
        title: "Tutor profile created! 🎉", 
        description: "You are now listed as a tutor." 
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create tutor profile.";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
      throw err;
    }
  };

  const updateTutorProfile = async (formData: TutorFormData): Promise<void> => {
    try {
      if (!formData.bio || !formData.course || !formData.hourlyRate) {
        throw new Error("Please fill in all required fields.");
      }

      const { updatedProfile } = await tutorsService.updateTutorProfile(formData);
      setUserTutorStatus(prev => ({ 
        ...prev, 
        userTutorProfile: updatedProfile 
      }));
      
      await fetchTutors();
      
      toast({ 
        title: "Profile Updated ✅", 
        description: "Tutor profile updated successfully." 
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update tutor profile.";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
      throw err;
    }
  };

  const scheduleSession = async (scheduleData: ScheduleFormData & { tutorId: string }): Promise<void> => {
    try {
      if (!scheduleData.sessionDate || !scheduleData.sessionTime || !scheduleData.duration || !scheduleData.price || !scheduleData.course) {
        throw new Error("Please fill in all required fields.");
      }

      const duration = parseInt(scheduleData.duration);
      const price = parseFloat(scheduleData.price);
      
      if (isNaN(duration) || duration < 1) {
        throw new Error("Duration must be at least 1 minute.");
      }

      if (isNaN(price) || price <= 0) {
        throw new Error("Price must be a positive number.");
      }

      // Validate date/time
      const selectedDateTime = new Date(`${scheduleData.sessionDate}T${scheduleData.sessionTime}`);
      const now = new Date();
      
      if (selectedDateTime <= now) {
        throw new Error("Please select a future date and time.");
      }

      toast({
        title: "Sending request...",
        description: "Please wait while we send your booking request",
      });

      await tutorsService.scheduleSession(scheduleData);

      toast({ 
        title: "Request Sent! ✅", 
        description: "Your tutoring request has been sent successfully." 
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to schedule session";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
      throw err;
    }
  };

  const toggleFavorite = async (tutorId: string): Promise<void> => {
    try {
      if (favorites.has(tutorId)) {
        await tutorsService.removeFavorite(tutorId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(tutorId);
          return newFavorites;
        });

        setTutors(prev => prev.map(tutor => 
          tutor.studentId === tutorId 
            ? { ...tutor, favoriteCount: Math.max(0, (tutor.favoriteCount || 1) - 1) }
            : tutor
        ));
        
        toast({ 
          title: "Removed from favorites", 
          description: "Tutor removed from your favorites." 
        });
      } else {
        await tutorsService.addFavorite(tutorId);
        setFavorites(prev => new Set(prev).add(tutorId));
        // Update favorite count locally
        setTutors(prev => prev.map(tutor => 
          tutor.studentId === tutorId 
            ? { ...tutor, favoriteCount: (tutor.favoriteCount || 0) + 1 }
            : tutor
        ));
        
        toast({ 
          title: "Added to favorites! ❤️", 
          description: "Tutor added to your favorites!" 
        });
      }
    } catch (err: any) {
      if (err.message.includes("Already added to favorites")) {
        setFavorites(prev => new Set(prev).add(tutorId));
        toast({ 
          title: "Already in favorites", 
          description: "This tutor is already in your favorites." 
        });
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to update favorites", 
          variant: "destructive" 
        });
        throw err;
      }
    }
  };

  return {
    tutors,
    favorites,
    userTutorStatus,
    loading,
    error,
    refetchTutors: fetchTutors,
    refetchFavorites: fetchFavorites,
    refetchUserStatus: fetchUserTutorStatus,
    toggleTutorMode,
    createTutorProfile,
    updateTutorProfile,
    scheduleSession,
    toggleFavorite,
  };
};