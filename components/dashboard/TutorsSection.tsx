import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tutor, ProfilePicture } from "@/interfaces/tutors.interfaces";
import { useState } from "react";
import { useMatchingTutors } from "@/hooks/useMatchingTutors";
import { Skeleton } from "@/components/ui/skeleton";

interface TutorSectionProps {
    tutors: Tutor[];   
}

export const TutorsSection = ({ tutors }: TutorSectionProps) => {
    const { toast } = useToast();
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const { matchedTutors, loading: matchLoading } = useMatchingTutors();

    // Use matched tutors if available, otherwise fall back to first 3 tutors
    const recommendedTutors = matchedTutors.length > 0 
        ? matchedTutors.slice(0, 3).map(m => m.tutor)
        : tutors.slice(0, 3);
    
    const handleViewAllClick = () => {
        toast({
            title: "Viewing all tutors",
            description: "Taking you to the tutors page"
        });
    };

    const handleViewTutorClick = (tutorName: string) => {
        toast({
            title: "Viewing tutor profile",
            description: `Opening ${tutorName}'s profile`
        });
    };

    // Helper function to check if profile picture is valid
    const hasValidProfilePicture = (tutor: Tutor): boolean => {
        if (!tutor.profilePicture) return false;
        
        const profilePic = tutor.profilePicture as ProfilePicture;
        return !!(profilePic.url && 
                 profilePic.url.trim() !== '' && 
                 !imageErrors.has(tutor.studentId));
    };

    // Helper function to get profile picture URL
    const getProfilePictureUrl = (tutor: Tutor): string => {
        if (!tutor.profilePicture) return '';
        const profilePic = tutor.profilePicture as ProfilePicture;
        return profilePic.url || '';
    };

    // Handle image loading errors
    const handleImageError = (tutorId: string) => {
        setImageErrors(prev => new Set(prev).add(tutorId));
    };

    return (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recommended Tutors</h2>
              {matchedTutors.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <Zap className="h-3 w-3" />
                  <span>Matched</span>
                </div>
              )}
            </div>
            <Link href="/tutors">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs sm:text-sm"
                onClick={handleViewAllClick}
              >
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {matchLoading ? (
              // Loading skeletons
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                      <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : recommendedTutors.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground mb-1">No tutors available</p>
                  <p className="text-sm text-muted-foreground">Check back later for tutor profiles</p>
                </CardContent>
              </Card>
            ) : (
              recommendedTutors.map((tutor) => (
                <Card key={tutor.studentId} className="transition-all hover:shadow-lg border hover:border-green-200">
                  <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    <div className="relative flex-shrink-0">
                      {/* Profile Picture with Fallback */}
                      {hasValidProfilePicture(tutor) ? (
                        <img 
                          src={getProfilePictureUrl(tutor)} 
                          alt={tutor.name || "Tutor"}
                          className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full object-cover border-2 border-gray-200"
                          onError={() => handleImageError(tutor.studentId)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base border-2 border-gray-200">
                          {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
                        </div>
                      )}
                      
                      {/* Favorite Count Badge */}
                      {tutor.favoriteCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs border-2 border-white">
                          {tutor.favoriteCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">
                        {tutor.name || tutor.username || "Unknown Tutor"}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
                        {tutor.course?.slice(0, 2).join(", ") || "No subjects"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {tutor.ratingAverage?.toFixed(1) || "0.0"} ({tutor.ratingCount || 0})
                        </span>
                        <span className="font-medium text-foreground">₱{tutor.hourlyRate || 0}/hr</span>
                      </div>
                    </div>
                    
                    <Link href={`/tutors/${tutor.studentId}`} className="flex-shrink-0">
                      <Button 
                        size="sm" 
                        className="text-xs sm:text-sm whitespace-nowrap"
                        onClick={() => handleViewTutorClick(tutor.name || tutor.username || "Tutor")}
                      >
                        View
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
    );
};