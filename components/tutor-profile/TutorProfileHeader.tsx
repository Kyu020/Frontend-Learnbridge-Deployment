// components/tutor-profile/TutorProfileHeader.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap, Heart } from "lucide-react";
import { Tutor, CompleteTutorProfile } from '@/interfaces/tutors.interfaces';

interface TutorProfileHeaderProps {
  tutor: Tutor | CompleteTutorProfile;
  isFavorite: boolean;
  averageRating: number;
  reviewsCount: number;
  onToggleFavorite: () => Promise<void>;
  onScheduleSession: () => void;
  onOpenReview: () => void;
  addingFavorite?: boolean;
}

export const TutorProfileHeader = ({ 
  tutor, 
  isFavorite, 
  averageRating, 
  reviewsCount, 
  onToggleFavorite, 
  onScheduleSession, 
  onOpenReview,
  addingFavorite = false 
}: TutorProfileHeaderProps) => {
  const isCompleteProfile = (tutor: Tutor | CompleteTutorProfile): tutor is CompleteTutorProfile => {
    return 'username' in tutor && 'email' in tutor && 'program' in tutor;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {tutor.profilePicture?.url ? (
              <img 
                src={tutor.profilePicture.url} 
                alt={tutor.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-lg">
                {tutor.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Rating Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {tutor.name}
                </h1>
                
                {/* Rating and Hourly Rate */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">
                      {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                    </span>
                    {reviewsCount > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({reviewsCount})
                      </span>
                    )}
                  </div>
                  
                  <div className="text-lg font-bold text-green-600">
                    ₱{tutor.hourlyRate}/hour
                  </div>
                </div>
              </div>

              {/* Favorite Status */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {tutor.favoriteCount > 0 && (
                  <span>{tutor.favoriteCount} favorite{tutor.favoriteCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="text-foreground leading-relaxed mb-4">
              {tutor.bio}
            </p>

            {/* Quick Info Badges */}
            <div className="flex flex-wrap gap-2">
              {isCompleteProfile(tutor) && tutor.program && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {tutor.program}
                </Badge>
              )}
              
              {tutor.teachingLevel && (
                <Badge variant="outline">
                  {tutor.teachingLevel} Level
                </Badge>
              )}
              
              {tutor.modeOfTeaching && tutor.modeOfTeaching !== 'either' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tutor.modeOfTeaching}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};