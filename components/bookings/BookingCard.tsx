// components/bookings/BookingCard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, CreditCard, Video, MessageSquare, MapPin, Edit, X, Check, AlertCircle, ExternalLink, Play, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { BookingWithSession } from '@/interfaces/bookings.interfaces';
import Link from "next/link";

interface BookingCardProps {
  booking: BookingWithSession;
  isTutorView?: boolean;
  onUpdateStatus?: (id: string, status: string, tutorComment?: string) => void;
  onCancelBooking?: (id: string) => void;
  onAddComment?: (id: string, comment: string) => void;
  onStartSession?: (sessionId: string) => void;
  onEvaluateSession?: (sessionId: string, status: 'completed' | 'no-show', rating?: number, review?: string) => void;
  onJoinMeeting: (booking: BookingWithSession) => void;
  updatingStatus?: boolean;
  showReviewLink?: boolean;
  tutorId?: string;
}

export function BookingCard({ 
  booking, 
  isTutorView = false,
  onUpdateStatus,
  onCancelBooking,
  onAddComment,
  onStartSession,
  onEvaluateSession,
  onJoinMeeting, 
  updatingStatus = false,
  showReviewLink = false,
  tutorId 
}: BookingCardProps) {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [comment, setComment] = useState(booking.comment || '');
  const [tutorComment, setTutorComment] = useState(booking.tutorComment || '');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  
  // Add local state for session management
  const [localSessionStatus, setLocalSessionStatus] = useState<string>('');
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [sessionEnded, setSessionEnded] = useState<boolean>(false);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to determine session status
  const getSessionStatus = (booking: BookingWithSession): string => {
    const now = new Date();
    const sessionDate = new Date(booking.sessionDate);
    const sessionDuration = booking.duration || 60; // minutes
    const sessionEnd = new Date(sessionDate.getTime() + sessionDuration * 60000);
    
    // Check if session is in the past
    const isPastSession = now > sessionEnd;
    
    // Check if session is currently happening
    const isLiveSession = now >= sessionDate && now <= sessionEnd;
    
    // Check if session has already been evaluated/completed
    if (booking.session?.rating || booking.session?.status === 'completed') {
      return 'completed';
    }
    
    // Check if session needs evaluation (based on session status or time passed)
    if (
      booking.session?.status === 'pending-evaluation' || 
      (booking.session?.status === 'in-progress' && isPastSession)
    ) {
      return 'pending-evaluation';
    }
    
    // If session is currently happening
    if (booking.isInProgress || (booking.session?.status === 'in-progress' && isLiveSession)) {
      return 'in-progress';
    }
    
    // If session is accepted but hasn't started yet
    if (booking.status === 'accepted' && now < sessionDate) {
      return 'upcoming';
    }
    
    // Default to booking status
    return booking.status;
  };

  // Update local session status when booking changes
  useEffect(() => {
    const status = getSessionStatus(booking);
    setLocalSessionStatus(status);
    
    // Check if session has started based on current time
    const now = new Date();
    const sessionDate = new Date(booking.sessionDate);
    if (now >= sessionDate && booking.status === 'accepted') {
      setSessionStarted(true);
    }
    
    // Check if session should have ended
    const sessionDuration = booking.duration || 60;
    const sessionEnd = new Date(sessionDate.getTime() + sessionDuration * 60000);
    if (now > sessionEnd && (booking.isInProgress || sessionStarted)) {
      setSessionEnded(true);
      setSessionStarted(false);
    }
  }, [booking]);

  // Timer for automatic status updates
  useEffect(() => {
    if (!booking.sessionDate) return;
    
    const sessionDate = new Date(booking.sessionDate);
    const sessionDuration = booking.duration || 60;
    const sessionEnd = new Date(sessionDate.getTime() + sessionDuration * 60000);
    const now = new Date();
    
    // Calculate time until session starts/ends
    const timeUntilStart = sessionDate.getTime() - now.getTime();
    const timeUntilEnd = sessionEnd.getTime() - now.getTime();
    
    // Set timer for session start
    let startTimer: NodeJS.Timeout;
    if (timeUntilStart > 0 && booking.status === 'accepted') {
      startTimer = setTimeout(() => {
        setLocalSessionStatus('upcoming');
      }, timeUntilStart);
    }
    
    // Set timer for session end (if session is in progress)
    let endTimer: NodeJS.Timeout;
    if (timeUntilEnd > 0 && localSessionStatus === 'in-progress') {
      endTimer = setTimeout(() => {
        setLocalSessionStatus('pending-evaluation');
        setSessionStarted(false);
        setSessionEnded(true);
      }, timeUntilEnd);
    }
    
    // Cleanup timers
    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (endTimer) clearTimeout(endTimer);
    };
  }, [booking, localSessionStatus]);

  const getStatusConfig = (status: string) => {
    const configs = {
      'pending': { 
        label: isTutorView ? 'Action Required' : 'Pending', 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: isTutorView ? <AlertCircle className="h-4 w-4" /> : null
      },
      'accepted': { 
        label: 'Confirmed', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <Check className="h-4 w-4" />
      },
      'rejected': { 
        label: 'Declined', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <X className="h-4 w-4" />
      },
      'cancelled': { 
        label: 'Cancelled', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <X className="h-4 w-4" />
      },
      'in-progress': { 
        label: 'Live Now', 
        color: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
        icon: <Play className="h-4 w-4" />
      },
      'completed': { 
        label: 'Completed', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <ThumbsUp className="h-4 w-4" />
      },
      'upcoming': { 
        label: 'Upcoming', 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <Clock className="h-4 w-4" />
      },
      'scheduled': { 
        label: 'Scheduled', 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <Clock className="h-4 w-4" />
      },
      'pending-evaluation': { 
        label: 'Needs Review', 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <Star className="h-4 w-4" />
      },
      'no-show': { 
        label: 'No Show', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <X className="h-4 w-4" />
      },
      'ended': {
        label: 'Session Ended', 
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: <Clock className="h-4 w-4" />
      },
    };
    return configs[status as keyof typeof configs] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: null 
    };
  };

  const handleSubmitComment = () => {
    if (isTutorView && onUpdateStatus) {
      onUpdateStatus(booking._id, booking.status, comment);
    } else if (onAddComment) {
      onAddComment(booking._id, comment);
    }
    setIsEditingComment(false);
  };

  const handleCancel = () => {
    if (onCancelBooking) {
      onCancelBooking(booking._id);
    }
    setIsCancelDialogOpen(false);
  };

  const handleAccept = () => {
    if (onUpdateStatus) {
      onUpdateStatus(booking._id, 'accepted', tutorComment);
    }
  };

  const handleDecline = () => {
    if (onUpdateStatus) {
      onUpdateStatus(booking._id, 'rejected', tutorComment);
    }
    setIsDeclineDialogOpen(false);
  };

  const handleStartSession = () => {
    if (booking.sessionId && onStartSession) {
      onStartSession(booking.sessionId);
      // Update local state
      setLocalSessionStatus('in-progress');
      setSessionStarted(true);
      setSessionEnded(false);
    }
  };

  const handleEndSession = () => {
    // Update local state to mark as ended
    setLocalSessionStatus('pending-evaluation');
    setSessionStarted(false);
    setSessionEnded(true);
    
    // Optional: Call an API endpoint if you have one
    // if (onUpdateStatus) {
    //   onUpdateStatus(booking._id, 'pending-evaluation');
    // }
  };

  const handleSubmitEvaluation = (status: 'completed' | 'no-show') => {
    if (booking.sessionId && onEvaluateSession) {
      onEvaluateSession(booking.sessionId, status, rating, review);
      setIsEvaluationDialogOpen(false);
      setRating(0);
      setReview('');
      
      // Update local status after evaluation
      if (status === 'completed') {
        setLocalSessionStatus('completed');
      } else {
        setLocalSessionStatus('no-show');
      }
    }
  };

  // Use localSessionStatus for all status-related logic
  const statusConfig = getStatusConfig(localSessionStatus);
  const canStartSession = booking.canStart && localSessionStatus === 'upcoming';
  const needsEvaluation = localSessionStatus === 'pending-evaluation';

  // User info based on view
  const userInfo = isTutorView ? booking.studentInfo : booking.tutorInfo;
  const userRole = isTutorView ? 'Student' : 'Tutor';

  return (
    <>
      <Card className="w-full mb-6 hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={userInfo?.profilePicture?.url} />
                <AvatarFallback className={`bg-gradient-to-br ${isTutorView ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-blue-600'} text-white`}>
                  {userInfo?.username?.charAt(0).toUpperCase() || userRole.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {booking.course}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {isTutorView ? 'Request from' : 'with'} <span className="font-semibold">{userInfo?.username || userRole}</span>
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`px-3 py-1.5 font-semibold border flex items-center gap-2 ${statusConfig.color}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Booking Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date & Time</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatDate(booking.sessionDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(booking.sessionDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-base font-semibold text-gray-900">
                    {booking.duration} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{isTutorView ? 'Earnings' : 'Price'}</p>
                  <p className="text-base font-semibold text-gray-900">
                    ₱{booking.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Mode</p>
                  <p className="text-base font-semibold text-gray-900">
                    {booking.modality === 'online' ? '🌐 Online' : '👥 In-person'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info & Actions */}
            <div className="space-y-4">
              {/* Comment from other party */}
              {(isTutorView ? booking.comment : booking.tutorComment) && (
                <div className={`border rounded-xl p-4 ${isTutorView ? 'bg-gray-50 border-gray-100' : 'bg-yellow-50 border-yellow-100'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className={`h-4 w-4 ${isTutorView ? 'text-gray-600' : 'text-yellow-600'}`} />
                    <p className="text-sm font-semibold">
                      {isTutorView ? 'Student\'s Note' : 'Tutor\'s Note'}
                    </p>
                  </div>
                  <p className={isTutorView ? 'text-gray-800 text-sm' : 'text-yellow-800 text-sm'}>
                    {isTutorView ? booking.comment : booking.tutorComment}
                  </p>
                </div>
              )}

              {/* Meeting Info or Review Link */}
              {booking.meetingUrl && !showReviewLink && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-700">Meeting Link</p>
                    </div>
                    <Badge variant="outline" className="bg-white text-blue-600 border-blue-200">
                      Ready
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                    onClick={() => onJoinMeeting(booking)}
                  >
                    {localSessionStatus === 'in-progress' ? (
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        Join Live Session
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Test Meeting Link <ExternalLink className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* Review Link for completed student bookings */}
              {showReviewLink && tutorId && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm font-semibold text-yellow-700">Rate Your Tutor</p>
                    </div>
                    <Badge variant="outline" className="bg-white text-yellow-600 border-yellow-200">
                      Review
                    </Badge>
                  </div>
                  <Link href={`/tutors/${tutorId}`} target="_blank">
                    <Button
                      variant="outline"
                      className="w-full bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700"
                    >
                      <span className="flex items-center gap-2">
                        Write a Review <Star className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                  <p className="text-xs text-yellow-600 mt-2 text-center">
                    Share your experience to help others
                  </p>
                </div>
              )}

              {/* Time Until Session */}
              {booking.timeUntil && booking.timeUntil.hours >= 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Session starts in</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {booking.timeUntil.hours}h {booking.timeUntil.minutes}m
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comment Input Section (for student view) */}
          {!isTutorView && booking.status === 'pending' && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Your Notes</p>
                  {!isEditingComment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingComment(true)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Notes
                    </Button>
                  )}
                </div>
                
                {isEditingComment ? (
                  <div className="space-y-3">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add or update your notes for the tutor..."
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSubmitComment}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingComment(false);
                          setComment(booking.comment || '');
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {comment || "No notes added yet. Add notes to communicate with your tutor."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Comment Input (for tutor view) */}
          {isTutorView && showCommentInput && booking.status === 'pending' && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Add a note for the student:</p>
              <Textarea
                value={tutorComment}
                onChange={(e) => setTutorComment(e.target.value)}
                placeholder="Add any special instructions or comments..."
                className="min-h-[100px]"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 border-t px-6 py-4">
          <div className="flex flex-wrap gap-2 w-full">
            {/* Pending Actions - Student View */}
            {!isTutorView && booking.status === 'pending' && (
              <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      Cancel Booking Request
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this booking request? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsCancelDialogOpen(false)}
                    >
                      Keep Request
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancel}
                    >
                      Yes, Cancel Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Pending Actions - Tutor View */}
            {isTutorView && booking.status === 'pending' && (
              <>
                <Button
                  onClick={handleAccept}
                  disabled={updatingStatus}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-200 min-w-[140px]"
                >
                  {updatingStatus ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Accepting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Accept Request
                    </span>
                  )}
                </Button>

                <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={updatingStatus}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 min-w-[140px]"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        Decline Booking Request
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you want to decline this booking request? The student will be notified.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Optional: Add a reason for declining..."
                        value={tutorComment}
                        onChange={(e) => setTutorComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        variant="outline"
                        onClick={() => setIsDeclineDialogOpen(false)}
                      >
                        Keep Request
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDecline}
                      >
                        Decline Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  onClick={() => setShowCommentInput(!showCommentInput)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </>
            )}

            {/* Session Actions */}
            {canStartSession && isTutorView && (
              <Button
                onClick={handleStartSession}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            )}

            {/* Live Session Status with End Session Button */}
            {localSessionStatus === 'in-progress' && isTutorView && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-700">Live Session</span>
                </div>
                <Button
                  onClick={handleEndSession}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            )}

            {localSessionStatus === 'in-progress' && !isTutorView && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="font-semibold text-blue-700">Session in progress</span>
              </div>
            )}

            {needsEvaluation && isTutorView && (
              <Button
                onClick={() => setIsEvaluationDialogOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-200"
              >
                <Star className="h-4 w-4 mr-2" />
                Evaluate Session
              </Button>
            )}

            {localSessionStatus === 'completed' && booking.session?.rating && (
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < booking.session!.rating!
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Session completed
                </span>
              </div>
            )}

            {/* Join Session Button for Students */}
            {localSessionStatus === 'in-progress' && booking.meetingUrl && !isTutorView && (
              <Button
                onClick={() => onJoinMeeting(booking)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-200"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Session Now
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Evaluation Dialog */}
      {isTutorView && (
        <Dialog open={isEvaluationDialogOpen} onOpenChange={setIsEvaluationDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Session Evaluation</DialogTitle>
              <DialogDescription>
                Rate your session with {booking.studentInfo?.username || 'the student'}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {/* Rating */}
              <div>
                <p className="text-sm font-medium mb-3">Session Rating</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review */}
              <div>
                <p className="text-sm font-medium mb-2">Feedback (Optional)</p>
                <Textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="How was the session? Share your feedback..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  onClick={() => handleSubmitEvaluation('completed')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  disabled={rating === 0}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Complete ({rating}/5)
                </Button>
                <Button
                  onClick={() => handleSubmitEvaluation('no-show')}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Mark No-Show
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}