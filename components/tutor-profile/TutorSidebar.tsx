// components/tutor-profile/TutorSidebar.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Heart, MessageSquare, Star } from "lucide-react";
import { Tutor } from '@/interfaces/tutors.interfaces';

interface TutorSidebarProps {
  tutor: Tutor;
  isFavorite: boolean;
  averageRating: number;
  reviewsCount: number;
  onScheduleSession: () => void;
  onToggleFavorite: () => void;
  onOpenReview: () => void;
  addingFavorite: boolean;
}

export const TutorSidebar = ({
  tutor,
  isFavorite,
  averageRating,
  reviewsCount,
  onScheduleSession,
  onToggleFavorite,
  onOpenReview,
  addingFavorite
}: TutorSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Contact & Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Get in Touch</h3>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <User className="h-4 w-4" />
            <span className="break-all">Student ID: {tutor.studentId}</span>
          </div>

          <Button 
            onClick={onScheduleSession}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold mb-3"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Apply for Schedule
          </Button>

          <Button 
            variant="outline" 
            className={`w-full ${isFavorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
            onClick={onToggleFavorite}
            disabled={addingFavorite}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {addingFavorite ? "Processing..." : (isFavorite ? "Remove from Favorites" : "Add to Favorites")}
          </Button>

          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={onOpenReview}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Tutor Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly Rate</span>
              <span className="font-semibold">₱{tutor.hourlyRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Courses</span>
              <span className="font-semibold">{tutor.course.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-semibold">{tutor.availabilitySlots?.length || 0} slots</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-semibold flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                {averageRating} ({reviewsCount})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-semibold">{tutor.createdAt ? new Date(tutor.createdAt).getFullYear() : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};