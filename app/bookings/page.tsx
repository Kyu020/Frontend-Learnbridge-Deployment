"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { BookingsHeader } from "@/components/bookings/BookingsHeader"
import { BookingsTabs } from "@/components/bookings/BookingsTabs"
import { useBookings } from "@/hooks/useBookings"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { BookingWithSession } from '@/interfaces/bookings.interfaces'

type BookingUpdate = {
  status?: string;
  tutorComment?: string;
  comment?: string;
}

export default function BookingsPage() {
  const { toast } = useToast()
  
  // All hooks must be called unconditionally at the top level
  const [activeTab, setActiveTab] = useState("upcoming")
  const [checkingSessionTimes, setCheckingSessionTimes] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now())

  // Refs to prevent infinite loops
  const isCheckingRef = useRef(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Use the hook - must be called unconditionally
  const {
    sentBookings,
    receivedBookings,
    upcomingSessions,
    isTutor,
    tutorStatusLoading,
    loading,
    sentError,
    receivedError,
    updatingStatus,
    refetchBookings,
    updateBookingStatus,
    startSession,
    evaluateSession,
    joinMeeting,
  } = useBookings()

  // Handler functions - defined with useCallback but called unconditionally
  const handleRefresh = useCallback(async () => {
    try {
      await refetchBookings();
      setLastRefreshTime(Date.now());
      toast({
        title: "Refreshed!",
        description: "Your bookings are now up to date",
      });
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  }, [refetchBookings, toast]);

  const handleStartSessionWrapper = useCallback(async (sessionId: string) => {
    try {
      await startSession(sessionId);
      // Wait a bit then refresh
      setTimeout(() => {
        handleRefresh();
      }, 1000);
    } catch (error) {
      // Error handled in hook
    }
  }, [startSession, handleRefresh]);

  const handleEvaluateSessionWrapper = useCallback(async (
    sessionId: string, 
    status: 'completed' | 'no-show', 
    rating?: number, 
    review?: string
  ) => {
    try {
      await evaluateSession(sessionId, status, rating, review);
      // Wait a bit then refresh
      setTimeout(() => {
        handleRefresh();
      }, 1000);
    } catch (error) {
      // Error handled in hook
    }
  }, [evaluateSession, handleRefresh]);

  // Function to check and update session statuses based on time
  const checkSessionStatuses = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingRef.current || loading || tutorStatusLoading) {
      return;
    }

    isCheckingRef.current = true;
    setCheckingSessionTimes(true);
    
    try {
      const now = new Date();
      let needsRefresh = false;
      let sessionsToStart: string[] = [];

      // Check all bookings for time-based status updates
      [...sentBookings, ...receivedBookings].forEach(booking => {
        const sessionStatus = booking.session?.status || booking.status;
        const sessionDate = new Date(booking.sessionDate);
        const sessionEnd = new Date(sessionDate.getTime() + (booking.duration * 60000));
        
        // If session is accepted/scheduled/upcoming and time has arrived, it should be in-progress
        if ((sessionStatus === 'accepted' || sessionStatus === 'scheduled' || sessionStatus === 'upcoming') &&
            now >= sessionDate && now <= sessionEnd) {
          console.log(`Session ${booking._id} should be in-progress (time window active)`);
          needsRefresh = true;
          
          // If tutor and session hasn't started yet, add to list
          if (isTutor && booking.sessionId && booking.status !== 'in-progress') {
            sessionsToStart.push(booking.sessionId);
          }
        }
        
        // If session time has passed and still in accepted/upcoming status, mark as missed
        if ((sessionStatus === 'accepted' || sessionStatus === 'upcoming' || sessionStatus === 'scheduled') &&
            now > sessionEnd) {
          console.log(`Session ${booking._id} time has passed without starting`);
          needsRefresh = true;
        }
      });

      // Auto-start sessions for tutor
      if (sessionsToStart.length > 0 && isTutor) {
        for (const sessionId of sessionsToStart) {
          try {
            await startSession(sessionId);
          } catch (error) {
            console.error(`Failed to auto-start session ${sessionId}:`, error);
          }
        }
      }

      // Only refresh if it's been at least 30 seconds since last refresh
      const timeSinceLastRefresh = Date.now() - lastRefreshTime;
      if (needsRefresh && timeSinceLastRefresh > 30000) {
        console.log("Refreshing bookings due to session time updates");
        setLastRefreshTime(Date.now());
        await refetchBookings();
        
        toast({
          title: "Session Status Updated",
          description: "Updated session statuses based on current time",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error checking session statuses:", error);
    } finally {
      isCheckingRef.current = false;
      setCheckingSessionTimes(false);
    }
  }, [sentBookings, receivedBookings, loading, tutorStatusLoading, refetchBookings, lastRefreshTime, isTutor, startSession, toast]);

  // Use a debounced effect for checking session times
  useEffect(() => {
    if (loading || tutorStatusLoading) return;

    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Set up periodic checks (every 2 minutes instead of 1 minute)
    refreshTimeoutRef.current = setInterval(() => {
      checkSessionStatuses();
    }, 120000); // Check every 2 minutes

    // Initial check after a delay
    const initialTimeout = setTimeout(() => {
      checkSessionStatuses();
    }, 5000);

    return () => {
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, [checkSessionStatuses, loading, tutorStatusLoading]);

  // Organize bookings by status for tabs with proper flow logic - use useMemo
  const organizedBookings = useMemo(() => {
    const allBookings = [...sentBookings, ...receivedBookings];
    
    // Helper to get display status with time-based logic
    const getDisplayStatus = (booking: BookingWithSession): string => {
      // Use session status as primary source
      const sessionStatus = booking.session?.status || booking.status;
      
      // If session has specific status, use it
      if (sessionStatus === 'in-progress' || 
          sessionStatus === 'completed' || 
          sessionStatus === 'pending-evaluation' ||
          sessionStatus === 'rejected' || 
          sessionStatus === 'cancelled' || 
          sessionStatus === 'no-show') {
        return sessionStatus;
      }
      
      // For accepted/scheduled/upcoming, check time
      if (sessionStatus === 'accepted' || sessionStatus === 'scheduled' || sessionStatus === 'upcoming') {
        const now = new Date();
        const sessionDate = new Date(booking.sessionDate);
        const sessionEnd = new Date(sessionDate.getTime() + (booking.duration * 60000));
        
        // Session is currently happening
        if (now >= sessionDate && now <= sessionEnd) {
          return 'in-progress';
        }
        
        // Session hasn't started yet
        if (now < sessionDate) {
          return 'upcoming';
        }
        
        // Session time passed without starting
        return 'upcoming'; // Keep as upcoming for manual handling
      }
      
      // Pending requests
      if (sessionStatus === 'pending') {
        return 'pending';
      }
      
      return sessionStatus;
    };
    
    const organized = {
      upcoming: [] as BookingWithSession[],
      inProgress: [] as BookingWithSession[],
      completed: [] as BookingWithSession[],
      pendingEvaluation: [] as BookingWithSession[],
      declined: [] as BookingWithSession[],
    };
    
    allBookings.forEach(booking => {
      const displayStatus = getDisplayStatus(booking);
      
      if (displayStatus === 'pending' || displayStatus === 'accepted' || 
          displayStatus === 'scheduled' || displayStatus === 'upcoming') {
        organized.upcoming.push(booking);
      } else if (displayStatus === 'in-progress') {
        organized.inProgress.push(booking);
      } else if (displayStatus === 'completed') {
        organized.completed.push(booking);
      } else if (displayStatus === 'pending-evaluation') {
        organized.pendingEvaluation.push(booking);
      } else if (displayStatus === 'rejected' || displayStatus === 'cancelled' || displayStatus === 'no-show') {
        organized.declined.push(booking);
      } else {
        // Default to upcoming for unknown statuses
        console.warn(`Unknown status ${displayStatus} for booking ${booking._id}`);
        organized.upcoming.push(booking);
      }
    });
    
    return organized;
  }, [sentBookings, receivedBookings]);

  // Calculate stats for header - use useMemo
  const { upcomingCount, inProgressCount, completedCount, pendingEvaluationCount, declinedCount, totalEarnings } = useMemo(() => {
    const upcomingCount = organizedBookings.upcoming.length;
    const inProgressCount = organizedBookings.inProgress.length;
    const completedCount = organizedBookings.completed.length;
    const pendingEvaluationCount = organizedBookings.pendingEvaluation.length;
    const declinedCount = organizedBookings.declined.length;

    // Calculate earnings (if tutor)
    const totalEarnings = isTutor ? receivedBookings
      .filter(b => b.status === 'completed' || b.status === 'pending-evaluation')
      .reduce((sum, b) => sum + (b.price || 0), 0) : 0;

    return {
      upcomingCount,
      inProgressCount,
      completedCount,
      pendingEvaluationCount,
      declinedCount,
      totalEarnings
    };
  }, [organizedBookings, isTutor, receivedBookings]);

  // Simple handler functions that don't need useCallback
  const handleUpdateBooking = async (id: string, updates: BookingUpdate) => {
    try {
      await updateBookingStatus(id, updates.status, updates.tutorComment, updates.comment);
      // Don't immediately refetch - wait for the hook to handle it
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  // Show loading state while tutor status OR bookings are being determined
  if (tutorStatusLoading || isTutor === null) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-gray-500">Loading your booking information...</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <BookingsHeader 
            onRefresh={handleRefresh}
            refreshing={loading || checkingSessionTimes}
            upcomingCount={upcomingCount}
            inProgressCount={inProgressCount}
            totalEarnings={totalEarnings}
            completedCount={completedCount}
            pendingEvaluationCount={pendingEvaluationCount}
            declinedCount={declinedCount}
            isTutor={isTutor || false}
          />

          {/* Main Content Area */}
          <div className="mt-6">
            <BookingsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              loading={loading || checkingSessionTimes}
              sentError={sentError}
              receivedError={receivedError}
              onRefresh={handleRefresh}
              onUpdateBooking={handleUpdateBooking}
              onStartSession={handleStartSessionWrapper}
              onEvaluateSession={handleEvaluateSessionWrapper}
              onJoinMeeting={joinMeeting}
              updatingStatus={updatingStatus}
              organizedBookings={organizedBookings}
              sentBookings={sentBookings}
              receivedBookings={receivedBookings}
            />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}