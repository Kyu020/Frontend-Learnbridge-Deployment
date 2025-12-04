// components/bookings/BookingsTabs.tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingCard } from "@/components/bookings/BookingCard"
import { Loader2, AlertCircle, Clock, Star } from "lucide-react"
import { BookingWithSession } from '@/interfaces/bookings.interfaces'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BookingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  loading: boolean;
  sentError: string | null;
  receivedError: string | null;
  onRefresh: () => void;
  onUpdateBooking: (id: string, updates: any) => void;
  onStartSession: (sessionId: string) => void;
  onEvaluateSession: (sessionId: string, status: 'completed' | 'no-show', rating?: number, review?: string) => void;
  onJoinMeeting: (booking: BookingWithSession) => void;
  updatingStatus: boolean;
  organizedBookings: {
    upcoming: BookingWithSession[];
    inProgress: BookingWithSession[];
    completed: BookingWithSession[];
    pendingEvaluation: BookingWithSession[];
    declined: BookingWithSession[];
  };
  sentBookings: BookingWithSession[];
  receivedBookings: BookingWithSession[];
}

export function BookingsTabs({
  activeTab,
  onTabChange,
  loading,
  sentError,
  receivedError,
  onRefresh,
  onUpdateBooking,
  onStartSession,
  onEvaluateSession,
  onJoinMeeting,
  updatingStatus,
  organizedBookings,
  sentBookings,
  receivedBookings,
}: BookingsTabsProps) {
  // Function to check if booking is from sent or received
  const getBookingType = (booking: BookingWithSession) => {
    const isSent = sentBookings.some(b => b._id === booking._id);
    return isSent ? 'sent' : 'received';
  };

  // Calculate total hours in completed bookings
  const calculateTotalHours = () => {
    return organizedBookings.completed.reduce((totalHours, booking) => {
      return totalHours + (booking.duration || 0);
    }, 0);
  };

  const totalCompletedHours = calculateTotalHours();
  const totalHoursFormatted = (totalCompletedHours / 60).toFixed(1); // Convert minutes to hours
  const totalHoursText = totalHoursFormatted === "1.0" ? "1 hour" : `${totalHoursFormatted} hours`;

  const renderBookings = (bookings: BookingWithSession[]) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        </div>
      );
    }

    if ((sentError || receivedError) && bookings.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load bookings</p>
          <button
            onClick={onRefresh}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookings found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {bookings.map((booking) => {
          const bookingType = getBookingType(booking);
          const isTutorView = bookingType === 'received';
          
          // For completed bookings in sent tab, we want to show review link instead of meeting link
          const showReviewLink = activeTab === 'completed' && !isTutorView;
          const tutorId = booking.tutorId;
          
          return (
            <BookingCard
              key={booking._id}
              booking={booking}
              isTutorView={isTutorView}
              onUpdateStatus={isTutorView ? (id, status, tutorComment) => 
                onUpdateBooking(id, { status, tutorComment }) : undefined}
              onCancelBooking={!isTutorView ? (id) => 
                onUpdateBooking(id, { status: 'cancelled' }) : undefined}
              onAddComment={!isTutorView ? (id, comment) => 
                onUpdateBooking(id, { comment }) : undefined}
              onStartSession={isTutorView ? onStartSession : undefined}
              onEvaluateSession={isTutorView ? onEvaluateSession : undefined}
              onJoinMeeting={onJoinMeeting}
              updatingStatus={updatingStatus}
              showReviewLink={showReviewLink}
              tutorId={tutorId}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Upcoming ({organizedBookings.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            In Progress ({organizedBookings.inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Completed ({organizedBookings.completed.length})
          </TabsTrigger>
          <TabsTrigger value="pendingEvaluation" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Needs Review ({organizedBookings.pendingEvaluation.length})
          </TabsTrigger>
          <TabsTrigger value="declined" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
            Declined ({organizedBookings.declined.length})
          </TabsTrigger>
        </TabsList>

        {/* Completed Tab Header with Total Hours */}
        {activeTab === 'completed' && organizedBookings.completed.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Total Learning Time</p>
                  <p className="text-2xl font-bold text-green-900">{totalHoursText}</p>
                </div>
              </div>
              <p className="text-sm text-green-600">
                Across {organizedBookings.completed.length} completed sessions
              </p>
            </div>
          </div>
        )}

        <TabsContent value="upcoming" className="m-0">
          {renderBookings(organizedBookings.upcoming)}
        </TabsContent>

        <TabsContent value="inProgress" className="m-0">
          {renderBookings(organizedBookings.inProgress)}
        </TabsContent>

        <TabsContent value="completed" className="m-0">
          {renderBookings(organizedBookings.completed)}
        </TabsContent>

        <TabsContent value="pendingEvaluation" className="m-0">
          {renderBookings(organizedBookings.pendingEvaluation)}
        </TabsContent>

        <TabsContent value="declined" className="m-0">
          {renderBookings(organizedBookings.declined)}
        </TabsContent>
      </Tabs>
    </div>
  );
}