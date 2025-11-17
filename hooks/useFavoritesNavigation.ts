import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FavoriteTutor, FavoriteResource } from "@/interfaces/favorites.interfaces";

export const useFavoritesNavigation = () => {
  const router = useRouter();

  const handleViewProfile = (tutor: FavoriteTutor) => {
    if (tutor?.studentId) {
      toast({
        title: "Opening profile...",
        description: "Redirecting to tutor profile",
      });
      router.push(`/tutors/${tutor.studentId}`);
    } else {
      toast({
        title: "Error",
        description: "Unable to view tutor profile",
        variant: "destructive"
      });
    }
  };

  const handleBookNow = (tutor: FavoriteTutor) => {
    if (tutor?.studentId) {
      toast({
        title: "Booking session...",
        description: "Redirecting to book a session",
      });
      sessionStorage.setItem('autoOpenBooking', 'true');
      router.push(`/tutors/${tutor.studentId}`);
    } else {
      toast({
        title: "Error",
        description: "Unable to book session",
        variant: "destructive"
      });
    }
  };

  const handleViewResource = (resource: FavoriteResource) => {
    if (resource?.googleDriveLink) {
      toast({
        title: "Opening resource...",
        description: "Opening the resource in a new tab",
      });
      window.open(resource.googleDriveLink, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Error",
        description: "Resource link not available",
        variant: "destructive"
      });
    }
  };

  const handleBrowseRedirect = (page: string) => {
    toast({
      title: "Redirecting...",
      description: `Taking you to ${page} page`,
    });
  };

  return {
    handleViewProfile,
    handleBookNow,
    handleViewResource,
    handleBrowseRedirect
  };
};