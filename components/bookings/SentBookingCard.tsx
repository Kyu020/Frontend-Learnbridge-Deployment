// components/bookings/SentBookingCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, DollarSign, BookOpen, MessageSquare, Video, X, Edit } from "lucide-react";
import { Booking, ProfilePicture } from '@/interfaces/bookings.interfaces';
import { formatSessionDate, formatDuration, getStatusColor } from '@/lib/booking-utils';
import { useState } from "react";

interface SentBookingCardProps {
  booking: Booking;
  onJoinMeeting?: (roomId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onAddComment?: (bookingId: string, comment: string) => void;
}

export const SentBookingCard = ({ 
  booking,
  onJoinMeeting,
  onCancelBooking,
  onAddComment
}: SentBookingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [newComment, setNewComment] = useState(booking.comment || "");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Profile picture handling for tutor
  const hasValidProfilePicture = (): boolean => {
    if (!booking.tutorInfo?.profilePicture) return false;
    
    const profilePic = booking.tutorInfo.profilePicture as ProfilePicture;
    return !!(profilePic.url && profilePic.url.trim() !== '' && !imageError);
  };

  const getProfilePictureUrl = (): string => {
    if (!booking.tutorInfo?.profilePicture) return '';
    const profilePic = booking.tutorInfo.profilePicture as ProfilePicture;
    return profilePic.url || '';
  };

  // Check if booking can be cancelled (pending or accepted status)
  const canCancelBooking = (booking.status === "pending" || booking.status === "accepted") && onCancelBooking;

  // Check if comment can be edited (pending or accepted status)
  const canEditComment = (booking.status === "pending" || booking.status === "accepted") && onAddComment;

  const handleJoinMeeting = () => {
    if (booking.roomId) {
      const meetUrl = `http://localhost:3000/meeting/${booking.roomId}`;
      window.open(meetUrl, '_blank', 'noopener,noreferrer');
      
      if (onJoinMeeting) {
        onJoinMeeting(booking.roomId);
      }
    }
  };

  const handleCancelBooking = () => {
    if (onCancelBooking) {
      onCancelBooking(booking._id);
      setShowCancelConfirm(false);
    }
  };

  const handleSaveComment = () => {
    if (onAddComment && newComment.trim() !== booking.comment) {
      onAddComment(booking._id, newComment.trim());
    }
    setIsEditingComment(false);
  };

  const handleCancelComment = () => {
    setNewComment(booking.comment || "");
    setIsEditingComment(false);
  };

  // Check if meeting can be joined
  const canJoinMeeting = booking.status === "accepted" && booking.modality === "online" && booking.roomId;
  const meetingTime = new Date(booking.sessionDate);
  const now = new Date();
  const canStartMeeting = meetingTime <= new Date(now.getTime() + 15 * 60 * 1000);
  const isMeetingActive = meetingTime <= now;

  // Use profile picture if available and valid, otherwise fallback to initial
  const profileImage = hasValidProfilePicture() ? (
    <img 
      src={getProfilePictureUrl()} 
      alt={booking.tutorInfo?.username || 'Tutor'}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
      onError={() => {
        setImageError(true);
      }}
      loading="lazy"
    />
  ) : (
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-bold border-2 border-gray-200">
      {booking.tutorInfo?.username?.charAt(0)?.toUpperCase() || 'T'}
    </div>
  );

  return (
    <Card className="transition-shadow hover:shadow-lg relative">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 sm:block sm:w-16">
            {profileImage}
            {/* Mobile status badge */}
            <Badge className={`sm:hidden ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="font-semibold text-foreground truncate">{booking.tutorInfo?.username || 'Tutor'}</h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {booking.tutorInfo?.program || "Tutor"}  
                </p>
                
                {/* Session Details */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">Course:</span>
                    <Badge variant="outline" className="break-words whitespace-normal">
                      {booking.course}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium">Duration:</span>
                    <span>{formatDuration(booking.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="font-medium flex-shrink-0">Session:</span>
                    <span className="truncate ml-1">{formatSessionDate(booking.sessionDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="font-medium">Price:</span>
                    <span>₱{booking.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Modality Badge */}
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className={
                      booking.modality === "online" 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {booking.modality === "online" ? "🎥 Online Session" : "📍 In-Person Session"}
                  </Badge>
                </div>

                {/* Student Comment Section */}
                <div className="mt-3">
                  {isEditingComment ? (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-2">Your Note:</p>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a note for the tutor..."
                            className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            maxLength={500}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {newComment.length}/500 characters
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelComment}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleSaveComment}
                                disabled={!newComment.trim()}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-700">Your Note:</p>
                            <p className="text-sm text-gray-600 mt-1 break-words">
                              {booking.comment || "No note added"}
                            </p>
                          </div>
                        </div>
                        {canEditComment && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingComment(true)}
                            className="flex-shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tutor Comment */}
                {booking.tutorComment && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-blue-700">Tutor's Response:</p>
                        <p className="text-sm text-blue-600 mt-1 break-words">{booking.tutorComment}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Jitsi Meeting Info - FOR STUDENTS */}
                {canJoinMeeting && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-medium text-blue-900">
                            Virtual Meeting Room Ready
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-blue-700">Room ID:</span>
                          <Badge variant="secondary" className="text-xs">
                            {booking.roomId}
                          </Badge>
                        </div>
                        {booking.tutorComment && (
                          <p className="text-xs text-blue-600">
                            <span className="font-medium">Tutor's note:</span> {booking.tutorComment}
                          </p>
                        )}
                        {!canStartMeeting && (
                          <p className="text-xs text-blue-600 mt-1">
                            Meeting will be available 15 minutes before session time
                          </p>
                        )}
                        {isMeetingActive && (
                          <p className="text-xs text-green-600 font-medium">
                            ✅ Session is now active - You can join the meeting!
                          </p>
                        )}
                      </div>
                      {canStartMeeting && (
                        <Button
                          onClick={handleJoinMeeting}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap"
                        >
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:flex-col sm:items-end">
                {/* Desktop status badge */}
                <Badge className={`hidden sm:flex ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
                
                {/* Mobile date */}
                <span className="text-xs text-muted-foreground sm:hidden">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:flex-col sm:w-full">
                  {/* Join Meeting Button (Mobile) */}
                  {canJoinMeeting && canStartMeeting && (
                    <Button
                      onClick={handleJoinMeeting}
                      size="sm"
                      className="sm:hidden bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Join
                    </Button>
                  )}

                  {/* Cancel Booking Button */}
                  {canCancelBooking && !showCancelConfirm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelConfirm(true)}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="sm:hidden">Cancel</span>
                    </Button>
                  )}

                  {/* Cancel Confirmation */}
                  {showCancelConfirm && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-xs text-red-700 font-medium">Cancel?</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleCancelBooking}
                        className="h-6 px-2"
                      >
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCancelConfirm(false)}
                        className="h-6 px-2"
                      >
                        No
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};