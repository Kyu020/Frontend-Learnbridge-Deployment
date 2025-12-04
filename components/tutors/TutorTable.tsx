// components/tutors/TutorTable.tsx
import { Button } from "@/components/ui/button";
import { Heart, Calendar, User, Clock, Zap, Shield } from "lucide-react";
import { Tutor, CompleteTutorProfile, ProfilePicture } from '@/interfaces/tutors.interfaces';
import { useState } from "react";

interface TutorMatch {
  tutor: Tutor | CompleteTutorProfile;
  score: number;
}

interface TutorTableProps {
  tutors: (Tutor | CompleteTutorProfile)[];
  favorites: Set<string>;
  onToggleFavorite: (tutorId: string) => void;
  onScheduleSession: (tutor: Tutor | CompleteTutorProfile) => void;
  onViewProfile: (tutor: Tutor | CompleteTutorProfile) => void;
  isUpdatingFavorite?: string | null;
  matchScores?: Map<string, number>;
  showMatchScore?: boolean;
  credibilityScores?: Map<string, number>;
  showCredibility?: boolean;
}

export const TutorTable = ({
  tutors,
  favorites,
  onToggleFavorite,
  onScheduleSession,
  onViewProfile,
  isUpdatingFavorite = null,
  matchScores,
  showMatchScore = false,
  credibilityScores,
  showCredibility = false
}: TutorTableProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const hasValidProfilePicture = (tutor: Tutor | CompleteTutorProfile): boolean => {
    if (!tutor.profilePicture) return false;
    if (imageErrors.has(tutor.studentId)) return false;
    
    const profilePic = tutor.profilePicture as ProfilePicture;
    return !!(profilePic.url && profilePic.url.trim() !== '');
  };

  const getProfilePictureUrl = (tutor: Tutor | CompleteTutorProfile): string => {
    if (!tutor.profilePicture) return '';
    const profilePic = tutor.profilePicture as ProfilePicture;
    return profilePic.url || '';
  };

  const handleImageError = (tutorId: string) => {
    setImageErrors(prev => new Set(prev).add(tutorId));
  };

  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const displayName = (tutor: Tutor | CompleteTutorProfile): string => {
    return (tutor as CompleteTutorProfile).username || tutor.name;
  };

  const isFavorite = (tutorId: string): boolean => {
    return favorites.has(tutorId);
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tutor</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Program</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Subjects</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Rate</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Level</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Availability</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Rating</th>
            {showMatchScore && (
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Match</th>
            )}
            {showCredibility && (
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Credibility</th>
            )}
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor, index) => (
            <tr 
              key={tutor.studentId} 
              className={`border-b transition-colors hover:bg-gray-50 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {/* Tutor Name with Picture */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {hasValidProfilePicture(tutor) ? (
                    <img
                      src={getProfilePictureUrl(tutor)}
                      alt={tutor.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      onError={() => handleImageError(tutor.studentId)}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold border border-gray-200">
                      {getInitial(tutor.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {displayName(tutor)}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {tutor.bio?.substring(0, 40)}...
                    </p>
                  </div>
                </div>
              </td>

              {/* Program */}
              <td className="px-4 py-3">
                <p className="text-sm text-gray-600 line-clamp-1">
                  {(tutor as CompleteTutorProfile).program || "—"}
                </p>
              </td>

              {/* Subjects */}
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {tutor.course && tutor.course.length > 0 ? (
                    <>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {tutor.course[0]}
                      </span>
                      {tutor.course.length > 1 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                          +{tutor.course.length - 1}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </td>

              {/* Hourly Rate */}
              <td className="px-4 py-3 text-center">
                <p className="font-semibold text-green-600">₱{tutor.hourlyRate}</p>
                <p className="text-xs text-gray-500">/hr</p>
              </td>

              {/* Teaching Level */}
              <td className="px-4 py-3 text-center">
                <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full capitalize">
                  {tutor.teachingLevel || "—"}
                </span>
              </td>

              {/* Availability */}
              <td className="px-4 py-3 text-center">
                {tutor.availabilitySlots && tutor.availabilitySlots.length > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {tutor.availabilitySlots.filter(s => s.isActive).length} slots
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Not set</span>
                )}
              </td>

              {/* Rating */}
              <td className="px-4 py-3 text-center">
                {tutor.ratingCount > 0 ? (
                  <div>
                    <p className="font-semibold text-gray-900">
                      {tutor.ratingAverage.toFixed(1)} ⭐
                    </p>
                    <p className="text-xs text-gray-500">
                      ({tutor.ratingCount})
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">No ratings</span>
                )}
              </td>

              {/* Match Score */}
              {showMatchScore && (
                <td className="px-4 py-3 text-center">
                  {matchScores && matchScores.has(tutor.studentId) ? (
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {matchScores.get(tutor.studentId)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              )}

              {/* Credibility Score */}
              {showCredibility && (
                <td className="px-4 py-3 text-center">
                  {credibilityScores && credibilityScores.has(tutor.studentId) ? (
                    <div className="flex items-center justify-center gap-1">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-gray-900">
                        {credibilityScores.get(tutor.studentId)}
                      </span>
                      <span className="text-xs text-gray-500">/100</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              )}

              {/* Actions */}
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => onToggleFavorite(tutor.studentId)}
                    variant="outline"
                    disabled={isUpdatingFavorite === tutor.studentId}
                    size="sm"
                    className={`p-1.5 rounded transition-all ${
                      isFavorite(tutor.studentId)
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-200'
                    }`}
                    title="Add to favorites"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite(tutor.studentId) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>

                  <Button
                    onClick={() => onScheduleSession(tutor)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                    title="Schedule session"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => onViewProfile(tutor)}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-3 py-1 rounded transition-colors"
                    title="View profile"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {tutors.length === 0 && (
        <div className="w-full py-8 text-center text-gray-500">
          <p className="text-sm">No tutors found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};
