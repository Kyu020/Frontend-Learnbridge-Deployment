// components/tutor/TutorCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, User, Clock, DollarSign } from "lucide-react";
import { Tutor, CompleteTutorProfile, ProfilePicture } from '@/interfaces/tutors.interfaces';
import { useState } from "react";

interface TutorCardProps {
  tutor: Tutor | CompleteTutorProfile;
  isFavorite: boolean;
  onToggleFavorite: (tutorId: string) => void;
  onScheduleSession: (tutor: Tutor | CompleteTutorProfile) => void;
  onViewProfile: (tutor: Tutor | CompleteTutorProfile) => void;
  isUpdatingFavorite?: boolean;
}

export const TutorCard = ({ 
  tutor, 
  isFavorite, 
  onToggleFavorite, 
  onScheduleSession,
  onViewProfile,
  isUpdatingFavorite = false 
}: TutorCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Enhanced profile picture validation for ProfilePicture objects
  const hasValidProfilePicture = (): boolean => {
    if (!tutor.profilePicture) return false;
    
    const profilePic = tutor.profilePicture as ProfilePicture;
    return !!(profilePic.url && profilePic.url.trim() !== '' && !imageError);
  };

  const getProfilePictureUrl = (): string => {
    if (!tutor.profilePicture) return '';
    const profilePic = tutor.profilePicture as ProfilePicture;
    return profilePic.url || '';
  };

  // Use profile picture if available and valid, otherwise fallback to initial
  const profileImage = hasValidProfilePicture() ? (
    <img 
      src={getProfilePictureUrl()} 
      alt={tutor.name}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
      onError={() => {
        setImageError(true);
      }}
      loading="lazy"
    />
  ) : (
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-gray-200">
      {tutor.name.charAt(0).toUpperCase()}
    </div>
  );

  // Use username if available, otherwise fallback to name
  const displayName = (tutor as CompleteTutorProfile).username || tutor.name;

  return (
    <Card className="transition-all hover:shadow-lg border-2 hover:border-blue-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Tutor Profile Image/Initial */}
          <div className="flex-shrink-0 flex items-start justify-center sm:justify-start">
            {profileImage}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header with name and price */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-1">
                  {displayName}
                </h3>
                {/* Show program if available */}
                {(tutor as CompleteTutorProfile).program && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {(tutor as CompleteTutorProfile).program}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {tutor.bio}
                </p>
              </div>
              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    {tutor.hourlyRate}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">per hour</p>
                </div>
                {/* Favorite Button */}
                <Button
                  onClick={() => onToggleFavorite(tutor.studentId)}
                  variant="outline"
                  disabled={isUpdatingFavorite}
                  className={`p-2 sm:p-3 rounded-lg transition-all duration-200 flex-shrink-0 ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart 
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
            </div>
            
            {/* Subjects */}
            <div className="flex flex-wrap gap-2 my-3">
              {tutor.course && tutor.course.length > 0 ? (
                tutor.course.slice(0, 3).map((subject, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No subjects listed</span>
              )}
              {tutor.course && tutor.course.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tutor.course.length - 3} more
                </Badge>
              )}
            </div>
            
            {/* Additional Info */}
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
              {/* Availability */}
              {tutor.availability && tutor.availability.length > 0 ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Available
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">No availability set</span>
              )}
              
              {/* Teaching Level */}
              {tutor.teachingLevel && (
                <Badge variant="outline" className="text-xs">
                  {tutor.teachingLevel}
                </Badge>
              )}
              
              {/* Mode of Teaching */}
              {tutor.modeOfTeaching && tutor.modeOfTeaching !== 'either' && (
                <Badge variant="outline" className="text-xs">
                  {tutor.modeOfTeaching}
                </Badge>
              )}
              
              {/* Favorite Count */}
              {tutor.favoriteCount > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
                  {tutor.favoriteCount} favorite{tutor.favoriteCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Credentials */}
            {tutor.credentials && (
              <p className="text-sm italic text-foreground mb-4 line-clamp-2">
                {tutor.credentials}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Schedule Button */}
              <Button
                onClick={() => onScheduleSession(tutor)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Apply for Schedule</span>
                <span className="xs:hidden">Schedule</span>
              </Button>

              {/* View Profile Button */}
              <Button
                onClick={() => onViewProfile(tutor)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">View Profile</span>
                <span className="xs:hidden">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};