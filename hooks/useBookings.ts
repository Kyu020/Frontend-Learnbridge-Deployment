import { useState, useEffect, useCallback } from 'react';
import { Booking, BookingWithSession, Session } from '@/interfaces/bookings.interfaces';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export const useBookings = () => {
  const [sentBookings, setSentBookings] = useState<BookingWithSession[]>([]);
  const [receivedBookings, setReceivedBookings] = useState<BookingWithSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [isTutor, setIsTutor] = useState<boolean | null>(null); // null means not loaded yet
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sentError, setSentError] = useState<string | null>(null);
  const [receivedError, setReceivedError] = useState<string | null>(null);
  const [tutorStatusLoading, setTutorStatusLoading] = useState(true); // Separate loading for tutor status
  const { toast } = useToast();

  // Check if user is tutor on initial load
  useEffect(() => {
    const checkTutorStatus = async () => {
      setTutorStatusLoading(true);
      try {
        const response = await api.get('/profile/getprofile');
        console.log('Profile response:', response.data);
        // The response structure is { user: { isTutor, ... } }
        const userIsTutor = response.data?.user?.isTutor || false;
        setIsTutor(userIsTutor);
        console.log('Tutor status loaded:', userIsTutor);
      } catch (err) {
        console.error('Error checking tutor status:', err);
        setIsTutor(false); // Default to false on error
      } finally {
        setTutorStatusLoading(false);
      }
    };
    
    checkTutorStatus();
  }, []);

  // Fetch all booking data
  const fetchBookings = useCallback(async (shouldFetchReceived: boolean) => {
    setLoading(true);
    setSentError(null);
    setReceivedError(null);

    try {
      // Fetch sent bookings (for both students and tutors)
      const sentResponse = await api.get('/request/getstudentrequests');
      const sentData = sentResponse.data.body || [];
      console.log('Sent bookings fetched:', sentData.length);
      
      // Fetch received bookings (only if tutor AND shouldFetchReceived is true)
      let receivedData: Booking[] = [];
      if (shouldFetchReceived) {
        console.log('Fetching received bookings...');
        const receivedResponse = await api.get('/request/getrequests');
        receivedData = receivedResponse.data.body || [];
        console.log('Received bookings fetched:', receivedData.length);
      } else {
        console.log('Skipping received bookings fetch (shouldFetchReceived:', shouldFetchReceived, ')');
      }
      
      // Fetch upcoming sessions for both
      const sessionsResponse = await api.get('/request/upcoming-sessions');
      const sessionsData = sessionsResponse.data.body || [];

      // Process sent bookings with session info
      const processedSentBookings = sentData.map((booking: Booking) => {
        const session = sessionsData.find((s: Session) => 
          s._id === booking.sessionId || 
          (s.studentId === booking.studentId && s.tutorId === booking.tutorId && 
           new Date(s.sessionDate).getTime() === new Date(booking.sessionDate).getTime())
        );
        
        return {
          ...booking,
          session,
          sessionId: session?._id || booking.sessionId,
          sessionEndTime: session ? calculateSessionEndTime(session.sessionDate, session.duration) : undefined,
          isInProgress: session?.status === 'in-progress',
          canStart: session ? canStartSession(session) : false,
          timeUntil: session ? calculateTimeUntil(session.sessionDate) : undefined
        };
      });

      // Process received bookings with session info
      const processedReceivedBookings = receivedData.map((booking: Booking) => {
        const session = sessionsData.find((s: Session) => 
          s._id === booking.sessionId || 
          (s.studentId === booking.studentId && s.tutorId === booking.tutorId && 
           new Date(s.sessionDate).getTime() === new Date(booking.sessionDate).getTime())
        );
        
        return {
          ...booking,
          session,
          sessionId: session?._id || booking.sessionId,
          sessionEndTime: session ? calculateSessionEndTime(session.sessionDate, session.duration) : undefined,
          isInProgress: session?.status === 'in-progress',
          canStart: session ? canStartSession(session) : false,
          timeUntil: session ? calculateTimeUntil(session.sessionDate) : undefined
        };
      });

      setSentBookings(processedSentBookings);
      setReceivedBookings(processedReceivedBookings);
      setUpcomingSessions(sessionsData);

    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setSentError(err.response?.data?.message || 'Failed to fetch sent bookings');
      if (shouldFetchReceived) {
        setReceivedError(err.response?.data?.message || 'Failed to fetch received bookings');
      }
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Helper functions
  const calculateSessionEndTime = (sessionDate: Date, duration: number): Date => {
    return new Date(new Date(sessionDate).getTime() + duration * 60000);
  };

  const calculateTimeUntil = (sessionDate: Date) => {
    const now = new Date();
    const timeUntil = new Date(sessionDate).getTime() - now.getTime();
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      hours,
      minutes,
      formatted: `${hours}h ${minutes}m`
    };
  };

  const canStartSession = (session: Session): boolean => {
    const now = new Date();
    const sessionStart = new Date(session.sessionDate);
    const fifteenMinutesBefore = new Date(sessionStart.getTime() - 15 * 60000);
    
    return now >= fifteenMinutesBefore && 
           now <= sessionStart && 
           (session.status === 'upcoming' || session.status === 'scheduled');
  };

  // Update booking status
  const updateBookingStatus = async (
    bookingId: string, 
    status?: string, 
    tutorComment?: string, 
    comment?: string
  ) => {
    setUpdatingStatus(true);
    try {
      const response = await api.put(`/request/updaterequeststatus/${bookingId}`, {
        status,
        tutorComment,
        comment
      });

      toast({
        title: "Success",
        description: response.data.message || "Booking updated successfully",
      });

      // Refresh bookings data
      await refetchBookings();
      
      return response.data;
    } catch (err: any) {
      console.error('Error updating booking:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update booking",
        variant: "destructive"
      });
      throw err;
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Start a session
  const startSession = async (sessionId: string) => {
    try {
      const response = await api.post(`/request/start-session/${sessionId}`);
      
      toast({
        title: "Session Started",
        description: "The session has been marked as in-progress",
      });

      // Refresh bookings to update status
      await refetchBookings();
      
      return response.data;
    } catch (err: any) {
      console.error('Error starting session:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to start session",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Evaluate a session
  const evaluateSession = async (
    sessionId: string, 
    status: 'completed' | 'no-show', 
    rating?: number, 
    review?: string,
    noShowParty?: string
  ) => {
    try {
      const response = await api.post(`/request/evaluate-session/${sessionId}`, {
        status,
        rating,
        review,
        noShowParty
      });

      toast({
        title: "Session Evaluated",
        description: response.data.message || "Session evaluation submitted",
      });

      // Refresh bookings data
      await refetchBookings();
      
      return response.data;
    } catch (err: any) {
      console.error('Error evaluating session:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to evaluate session",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Join meeting
  const joinMeeting = (booking: BookingWithSession) => {
    if (booking.meetingUrl) {
      window.open(booking.meetingUrl, '_blank');
    } else if (booking.session?.meetingUrl) {
      window.open(booking.session.meetingUrl, '_blank');
    } else {
      toast({
        title: "No Meeting Link",
        description: "Meeting link is not available yet",
        variant: "destructive"
      });
    }
  };

  // Refetch bookings with proper tutor status
  const refetchBookings = useCallback(async () => {
    console.log('Refetching with isTutor:', isTutor);
    await fetchBookings(isTutor === true);
  }, [fetchBookings, isTutor]);

  // Initial fetch when tutor status is loaded
  useEffect(() => {
    if (isTutor !== null && !tutorStatusLoading) {
      console.log('Fetching bookings with tutor status:', isTutor);
      fetchBookings(isTutor === true);
    }
  }, [isTutor, tutorStatusLoading, fetchBookings]);

  return {
    sentBookings,
    receivedBookings,
    upcomingSessions,
    isTutor, // Now returns null, false, or true
    tutorStatusLoading, // Use this to show loading state for tutor status
    loading, // Use this for bookings loading
    updatingStatus,
    sentError,
    receivedError,
    refetchBookings,
    updateBookingStatus,
    startSession,
    evaluateSession,
    joinMeeting,
  };
};