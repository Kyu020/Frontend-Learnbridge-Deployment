// components/tutor-profile/TutorInfoSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Award, Mail, GraduationCap } from "lucide-react";
import { Tutor, CompleteTutorProfile } from '@/interfaces/tutors.interfaces';

interface TutorInfoSectionProps {
  tutor: Tutor | CompleteTutorProfile;
}

export const TutorInfoSection = ({ tutor }: TutorInfoSectionProps) => {
  const isCompleteProfile = (tutor: Tutor | CompleteTutorProfile): tutor is CompleteTutorProfile => {
    return 'username' in tutor && 'email' in tutor && 'program' in tutor;
  };

  return (
    <div className="space-y-6">
      {/* Basic Info - Show if we have complete profile data */}
      {isCompleteProfile(tutor) && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Basic Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{tutor.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{tutor.program}</span>
              </div>
              {tutor.learningLevel && (
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{tutor.learningLevel} Level</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tutor.course) ? (
              tutor.course.map((course, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                  {course}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-sm py-2 px-3">
                {tutor.course || 'No subjects listed'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability
          </h2>
          <div className="space-y-3">
            {tutor.availability && tutor.availability.length > 0 ? (
              tutor.availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground break-words">{slot}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No availability set</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teaching Details */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Teaching Details
          </h2>
          <div className="space-y-3">
            {tutor.teachingLevel && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Teaching Level</span>
                <Badge variant="outline">{tutor.teachingLevel}</Badge>
              </div>
            )}
            {tutor.teachingStyle && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Teaching Style</span>
                <Badge variant="outline">{tutor.teachingStyle}</Badge>
              </div>
            )}
            {tutor.modeOfTeaching && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Mode of Teaching</span>
                <Badge variant="outline">{tutor.modeOfTeaching}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      {tutor.credentials && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Credentials
            </h2>
            <p className="text-foreground leading-relaxed break-words">{tutor.credentials}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};