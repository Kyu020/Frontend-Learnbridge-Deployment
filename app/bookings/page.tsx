// app/bookings/page.tsx
"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { BookingsHeader } from "@/components/bookings/BookingsHeader"
import { PanelSelector } from "@/components/bookings/PanelSelector"
import { TutorRegistrationMessage } from "@/components/bookings/TutorRegistrationMessage"
import { BookingsTabs } from "@/components/bookings/BookingsTab"
import { ReceivedBookingCard } from "@/components/bookings/ReceivedBookingCard"
import { SentBookingCard } from "@/components/bookings/SentBookingCard"
import { useBookings } from "@/hooks/useBookings"
import { Booking } from "@/interfaces/bookings.interfaces"
import { useToast } from "@/hooks/use-toast"

// Define the update type using the Booking status
type BookingUpdate = {
  status?: Booking["status"];
  tutorComment?: string;
  comment?: string;
}

export default function BookingsPage() {
  const { toast } = useToast()
  
  // State for UI controls
  const [activePanel, setActivePanel] = useState<"sent" | "received">("sent")
  const [activeTab, setActiveTab] = useState("pending")

  // Use the hook
  const {
    sentBookings,
    receivedBookings,
    isTutor,
    loading,
    sentError,
    receivedError,
    updatingStatus,
    refetchBookings,
    updateBookingStatus,
    joinMeeting,
  } = useBookings()

  // Handler functions
  const handleRefresh = async () => {
    toast({
      title: "Refreshing...",
      description: "Fetching latest booking data",
    })
    await refetchBookings()
    toast({
      title: "Refreshed",
      description: "Bookings data has been updated",
    })
  }

  // Single handler for all booking updates
  const handleUpdateBooking = async (id: string, updates: BookingUpdate) => {
    try {
      await updateBookingStatus(id, updates.status, updates.tutorComment, updates.comment);
      // No need to call handleRefresh - state is updated automatically
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  // Determine current data based on active panel
  const currentBookings = activePanel === "received" ? receivedBookings : sentBookings
  const currentError = activePanel === "received" ? receivedError : sentError

  // Render the appropriate booking card based on active panel
  const renderBookingCard = (booking: any) => {
    if (activePanel === "received") {
      return (
        <ReceivedBookingCard
          key={booking._id}
          booking={booking}
          onUpdateStatus={(id, status, tutorComment) => 
            handleUpdateBooking(id, { status, tutorComment })
          }
          updatingStatus={updatingStatus}
          onJoinMeeting={joinMeeting}
        />
      )
    } else {
      return (
        <SentBookingCard 
          key={booking._id} 
          booking={booking}
          onJoinMeeting={joinMeeting}
          onCancelBooking={(id) => 
            handleUpdateBooking(id, { status: 'cancelled' })
          }
          onAddComment={(id, comment) => 
            handleUpdateBooking(id, { comment })
          }
        />
      )
    }
  }

  const showTutorRegistrationMessage = activePanel === "received" && !isTutor

  return (
    <LayoutWrapper>
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Header Section */}
        <BookingsHeader 
          onRefresh={handleRefresh}
          refreshing={loading}
        />

        {/* Panel Selection */}
        <PanelSelector
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          sentCount={sentBookings.length}
          receivedCount={receivedBookings.length}
          isTutor={isTutor}
        />

        {/* Tutor Registration Message */}
        {showTutorRegistrationMessage && (
          <TutorRegistrationMessage />
        )}

        {/* Bookings Tabs */}
        <BookingsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activePanel={activePanel}
          currentBookings={currentBookings}
          loading={loading}
          error={currentError}
          onRefresh={handleRefresh}
          onUpdateStatus={activePanel === "received" ? 
            (id, status, tutorComment) => handleUpdateBooking(id, { status, tutorComment }) 
            : undefined
          }
          updatingStatus={updatingStatus}
          renderBookingCard={renderBookingCard}
        />
      </div>
    </LayoutWrapper>
  )
}