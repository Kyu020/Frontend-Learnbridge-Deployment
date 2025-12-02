// components/bookings/ReceivedBookingCard.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, MoreVertical, Check, Slash, User, DollarSign, BookOpen, MessageSquare, Video } from "lucide-react";
import { Booking, ProfilePicture } from '@/interfaces/bookings.interfaces';
import { formatSessionDate, formatDuration, getStatusColor } from '@/lib/booking-utils';
import { TutorCommentDialog } from './TutorCommentDialog';

interface ReceivedBookingCardProps {
  booking: Booking;
  onUpdateStatus: (id: string, status: Booking["status"], tutorComment?: string) => void;
  updatingStatus?: boolean;
  onJoinMeeting?: (roomId: string) => void;
}

export const ReceivedBookingCard = ({ 
  booking, 
  onUpdateStatus,
  updatingStatus = false,
  onJoinMeeting
}: ReceivedBookingCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    status: Booking["status"];
    id: string;
  } | null>(null);

  // Profile picture handling for student
  const hasValidProfilePicture = (): boolean => {
    if (!booking.studentInfo?.profilePicture) return false;
    
    const profilePic = booking.studentInfo.profilePicture as ProfilePicture;
    return !!(profilePic.url && profilePic.url.trim() !== '' && !imageError);
  };

  const getProfilePictureUrl = (): string => {
    if (!booking.studentInfo?.profilePicture) return '';
    const profilePic = booking.studentInfo.profilePicture as ProfilePicture;
    return profilePic.url || '';
  };

  // Use profile picture if available and valid, otherwise fallback to initial
  const profileImage = hasValidProfilePicture() ? (
    <img 
      src={getProfilePictureUrl()} 
      alt={booking.studentInfo?.username || 'Student'}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
      onError={() => {
        setImageError(true);
      }}
      loading="lazy"
    />
  ) : (
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-bold border-2 border-gray-200">
      {booking.studentInfo?.username?.charAt(0)?.toUpperCase() || 'S'}
    </div>
  );

  const handleStatusUpdate = (status: Booking["status"]) => {
    // For rejections and acceptions, require a comment
    if (status === "rejected" || status === "accepted" || status === "completed") {
      setPendingAction({ status, id: booking._id });
      setCommentDialogOpen(true);
    } else {
      // For other statuses, update directly without comment
      onUpdateStatus(booking._id, status);
    }
  };

  const handleCommentConfirm = (tutorComment: string) => {
    console.log("Comment confirmed with action:", pendingAction); // Debug log
    
    if (pendingAction) {
      onUpdateStatus(pendingAction.id, pendingAction.status, tutorComment);
      setCommentDialogOpen(false);
      setPendingAction(null);
    }
  };

  const handleCancelComment = () => {
    console.log("Comment dialog cancelled"); // Debug log
    setCommentDialogOpen(false);
    setPendingAction(null);
  };

  const handleJoinMeeting = () => {
    if (booking.roomId) {
      // Redirect to Jitsi Meet with the room ID
      const meetUrl = `https://learnbridge-dep-01.vercel.app/meeting/${booking.roomId}`;
      window.open(meetUrl, '_blank', 'noopener,noreferrer');
      
      // Optional: Also call the callback if provided
      if (onJoinMeeting) {
        onJoinMeeting(booking.roomId);
      }
    }
  };

  // Check if meeting can be joined
  const canJoinMeeting = booking.status === "accepted" && booking.modality === "online" && booking.roomId;
  const meetingTime = new Date(booking.sessionDate);
  const now = new Date();
  const canStartMeeting = meetingTime <= new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes before session
  const isMeetingActive = meetingTime <= now;

  return (
    <>
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
                    <h3 className="font-semibold text-foreground truncate">{booking.studentInfo?.username}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {booking.studentInfo?.program || "No program"}  
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

                  {/* Jitsi Meeting Info */}
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
                          {!canStartMeeting && (
                            <p className="text-xs text-blue-600 mt-1">
                              Meeting will be available 15 minutes before session time
                            </p>
                          )}
                          {isMeetingActive && (
                            <p className="text-xs text-green-600 font-medium">
                              ✅ Session is now active
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

                  {/* Student Comment */}
                  {booking.comment && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700">Student's Note:</p>
                          <p className="text-sm text-gray-600 mt-1 break-words">{booking.comment}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tutor Comment */}
                  {booking.tutorComment && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-blue-700">Your Response:</p>
                          <p className="text-sm text-blue-600 mt-1 break-words">{booking.tutorComment}</p>
                        </div>
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

                  {/* Action Dropdown Menu */}
                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updatingStatus}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {booking.status === "pending" && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate("accepted")}
                              disabled={updatingStatus}
                            >
                              <Check className="mr-2 h-4 w-4" /> Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate("rejected")} 
                              className="text-destructive"
                              disabled={updatingStatus}
                            >
                              <Slash className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {booking.status === "accepted" && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate("completed")}
                              disabled={updatingStatus}
                            >
                              <Check className="mr-2 h-4 w-4" /> Mark as Completed
                            </DropdownMenuItem>
                            {canJoinMeeting && canStartMeeting && (
                              <DropdownMenuItem 
                                onClick={handleJoinMeeting}
                              >
                                <Video className="mr-2 h-4 w-4" /> Join Meeting
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {/* Add option to update tutor comment for any status */}
                        <DropdownMenuItem 
                          onClick={() => {
                            setPendingAction({ status: booking.status, id: booking._id });
                            setCommentDialogOpen(true);
                          }}
                          disabled={updatingStatus}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Add/Update Comment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutor Comment Dialog */}
      <TutorCommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        booking={pendingAction ? booking : null}
        pendingStatus={pendingAction?.status || null}
        onConfirm={handleCommentConfirm}
        onCancel={handleCancelComment}
        loading={updatingStatus}
      />
    </>
  );
};