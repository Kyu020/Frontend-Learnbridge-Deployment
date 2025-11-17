import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tutorProfileService } from '@/services/tutor-profile.service';
import { CompleteTutorProfile, Review, ScheduleFormData, ReviewFormData, TutorProfileData } from '@/interfaces/tutors.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseTutorProfileReturn extends TutorProfileData {
  loading: boolean;
  reviewsLoading: boolean;
  error: string | null;
  scheduling: boolean;
  submittingReview: boolean;
  deletingReview: boolean;
  addingFavorite: boolean;
  refetchTutor: () => Promise<void>;
  refetchReviews: () => Promise<void>;
  refetchFavorites: () => Promise<void>;
  scheduleSession: (scheduleData: ScheduleFormData & { tutorId: string }) => Promise<void>;
  submitReview: (reviewData: ReviewFormData & { tutorId: string }) => Promise<void>;
  deleteReview: (tutorId: string) => Promise<void>;
  toggleFavorite: (tutorId: string) => Promise<void>;
}

export const useTutorProfile = (): UseTutorProfileReturn => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const studentId = params.studentId as string;

  const [tutor, setTutor] = useState<CompleteTutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);
  const [addingFavorite, setAddingFavorite] = useState(false);

  // Calculate derived data
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const avg = sum / reviews.length;
    return Number(avg.toFixed(1));
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length
    }));
  }, [reviews]);

  const userReview = useMemo(() => {
    const currentUserId = localStorage.getItem("studentId");
    return reviews.find(review => review.studentId === currentUserId) || null;
  }, [reviews]);

  const fetchTutorProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!studentId) {
        throw new Error("No tutor ID provided");
      }

      const { data } = await tutorProfileService.fetchTutorProfile(studentId);
      setTutor(data);
      
      toast({
        title: "Profile Loaded! 🎓",
        description: `Successfully loaded ${data.name}'s profile`,
      });
    } catch (err: any) {
      setError(err.message);
      
      if (err.message.includes('404')) {
        toast({ 
          title: "Tutor Not Found", 
          description: "The requested tutor profile could not be found", 
          variant: "destructive" 
        });
        router.push("/tutors");
      } else {
        toast({ 
          title: "Error Loading Profile", 
          description: "Failed to load tutor profile. Please try again.", 
          variant: "destructive" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (): Promise<void> => {
    if (!tutor) return;

    try {
      setReviewsLoading(true);
      const reviewsData = await tutorProfileService.fetchTutorReviews(tutor.studentId);
      setReviews(reviewsData);
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchFavorites = async (): Promise<void> => {
    try {
      const favoriteIds = await tutorProfileService.fetchFavorites();
      setFavorites(new Set(favoriteIds));
    } catch (err: any) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const loadData = async (): Promise<void> => {
    await fetchTutorProfile();
  };

  useEffect(() => {
    if (studentId) {
      loadData();
    }
  }, [studentId]);

  useEffect(() => {
    if (tutor) {
      fetchReviews();
      fetchFavorites();
    }
  }, [tutor]);

  const scheduleSession = async (scheduleData: ScheduleFormData & { tutorId: string }): Promise<void> => {
    try {
      setScheduling(true);

      // Validate inputs
      const duration = parseInt(scheduleData.duration);
      const price = parseFloat(scheduleData.price);
      const selectedDateTime = new Date(`${scheduleData.sessionDate}T${scheduleData.sessionTime}`);
      const now = new Date();

      if (isNaN(duration) || duration < 1) {
        throw new Error("Duration must be at least 1 minute.");
      }

      if (isNaN(price) || price <= 0) {
        throw new Error("Price must be a positive number.");
      }

      if (selectedDateTime <= now) {
        throw new Error("Please select a future date and time.");
      }

      await tutorProfileService.scheduleSession(scheduleData);
      
      toast({ 
        title: "Request Sent Successfully! ✅", 
        description: "Your tutoring request has been sent successfully." 
      });
    } catch (err: any) {
      toast({ 
        title: "Error Sending Request", 
        description: err.message, 
        variant: "destructive" 
      });
      throw err;
    } finally {
      setScheduling(false);
    }
  };

  const submitReview = async (reviewData: ReviewFormData & { tutorId: string }): Promise<void> => {
    try {
      setSubmittingReview(true);

      if (!reviewData.comment.trim()) {
        throw new Error("Please write a review comment before submitting");
      }

      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Please select a rating between 1 and 5 stars");
      }

      await tutorProfileService.submitReview(reviewData);
      
      // Refresh reviews
      await fetchReviews();
      
      toast({
        title: userReview ? "Review Updated Successfully! ✅" : "Review Submitted Successfully! 🎉",
        description: userReview 
          ? "Your review has been updated and is now visible to others" 
          : "Thank you for your review! Your feedback helps other students."
      });
    } catch (err: any) {
      let errorMessage = err.message || "Failed to submit review. Please try again.";
      
      if (err.message.includes('403')) {
        errorMessage = "You need to complete a session with this tutor before leaving a review.";
      } else if (err.message.includes('cannot review yourself')) {
        errorMessage = "You cannot leave a review for your own tutor profile.";
      } else if (err.message.includes('401')) {
        errorMessage = "Please log in to submit a review.";
      }
      
      toast({
        title: "Error Submitting Review",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setSubmittingReview(false);
    }
  };

  const deleteReview = async (tutorId: string): Promise<void> => {
    try {
      setDeletingReview(true);
      await tutorProfileService.deleteReview(tutorId);
      
      // Refresh reviews
      await fetchReviews();
      
      toast({
        title: "Review Deleted Successfully ✅",
        description: "Your review has been removed from the tutor's profile"
      });
    } catch (err: any) {
      toast({
        title: "Error Deleting Review",
        description: err.message || "Failed to delete review. Please try again.",
        variant: "destructive"
      });
      throw err;
    } finally {
      setDeletingReview(false);
    }
  };

  const toggleFavorite = async (tutorId: string): Promise<void> => {
    try {
      setAddingFavorite(true);

      if (favorites.has(tutorId)) {
        await tutorProfileService.removeFavorite(tutorId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(tutorId);
          return newFavorites;
        });
        
        toast({ 
          title: "Removed from Favorites", 
          description: "Tutor has been removed from your favorites list." 
        });
      } else {
        await tutorProfileService.addFavorite(tutorId);
        setFavorites(prev => new Set(prev).add(tutorId));
        
        toast({ 
          title: "Added to Favorites! ❤️", 
          description: "Tutor has been added to your favorites list!" 
        });
      }
    } catch (err: any) {
      if (err.message.includes("Already added to favorites")) {
        setFavorites(prev => new Set(prev).add(tutorId));
        toast({ 
          title: "Already in Favorites", 
          description: "This tutor is already in your favorites list." 
        });
      } else {
        toast({ 
          title: "Error Managing Favorite", 
          description: err.message, 
          variant: "destructive" 
        });
        throw err;
      }
    } finally {
      setAddingFavorite(false);
    }
  };

  return {
    tutor,
    reviews,
    userReview,
    favorites,
    averageRating,
    ratingCounts,
    loading,
    reviewsLoading,
    error,
    scheduling,
    submittingReview,
    deletingReview,
    addingFavorite,
    refetchTutor: fetchTutorProfile,
    refetchReviews: fetchReviews,
    refetchFavorites: fetchFavorites,
    scheduleSession,
    submitReview,
    deleteReview,
    toggleFavorite,
  };
};