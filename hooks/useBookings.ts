// hooks/useBookings.ts
import { useState, useEffect } from 'react';
import { bookingsService } from '@/services/bookings.service';
import { Booking, BookingsData } from '@/interfaces/bookings.interfaces';
import { useToast } from '@/hooks/use-toast';

interface UseBookingsReturn extends BookingsData {
  loading: boolean;
  sentError: string | null;
  receivedError: string | null;
  updatingStatus: boolean;
  refetchBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status?: Booking["status"], tutorComment?: string, comment?: string) => Promise<void>;
  joinMeeting: (roomId: string) => void;
}

export const useBookings = (): UseBookingsReturn => {
  const [bookingsData, setBookingsData] = useState<BookingsData>({
    sentBookings: [],
    receivedBookings: [],
    isTutor: false,
  });
  const [loading, setLoading] = useState(true);
  const [sentError, setSentError] = useState<string | null>(null);
  const [receivedError, setReceivedError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      setSentError(null);
      setReceivedError(null);

      console.log("🔄 Fetching bookings...");
      const data = await bookingsService.fetchBookings();
      console.log("📦 Bookings data received:", data);
      
      setBookingsData(data);

    } catch (error: any) {
      console.error("❌ Error fetching bookings:", error);
      toast({
        title: "Error loading bookings",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinMeeting = (roomId: string) => {
    window.open(`/meeting/${roomId}`, '_blank', 'noopener,noreferrer')
  }

  const updateBookingStatus = async (
    id: string, 
    status?: Booking["status"], 
    tutorComment?: string,
    comment?: string
  ): Promise<void> => {
    try {
      setUpdatingStatus(true);

      // Show appropriate loading message
      if (status === 'cancelled') {
        toast({
          title: "Cancelling booking...",
          description: "Please wait while we process your request",
        });
      } else if (comment !== undefined) {
        toast({
          title: "Updating comment...",
          description: "Please wait while we save your note",
        });
      } else {
        toast({
          title: "Updating booking...",
          description: "Please wait while we process your request",
        });
      }

      const existingSentBooking = bookingsData.sentBookings.find(b => b._id === id);
      const existingReceivedBooking = bookingsData.receivedBookings.find(b => b._id === id);
      const existingBooking = existingSentBooking || existingReceivedBooking;

      if (!existingBooking) {
        throw new Error("Booking not found in local state");
      }

      const updatedBooking = await bookingsService.updateBookingStatus(id, status, tutorComment, comment);

      const mergedBooking = {
        ...existingBooking,
        ...updatedBooking, 
        status: updatedBooking.status || existingBooking.status,
        tutorComment: updatedBooking.tutorComment !== undefined ? updatedBooking.tutorComment : existingBooking.tutorComment,
        comment: updatedBooking.comment !== undefined ? updatedBooking.comment : existingBooking.comment,
        updatedAt: updatedBooking.updatedAt,
        meetingId: updatedBooking.meetingId || existingBooking.meetingId,
        roomId: updatedBooking.roomId || existingBooking.roomId,
        meetingUrl: updatedBooking.meetingUrl || existingBooking.meetingUrl
      };

      // Update state with merged data
      setBookingsData(prev => ({
        ...prev,
        sentBookings: prev.sentBookings.map(booking =>
          booking._id === id ? mergedBooking : booking
        ),
        receivedBookings: prev.receivedBookings.map(booking =>
          booking._id === id ? mergedBooking : booking
        ),
      }));

      // Show success toast based on action
      let toastTitle = "";
      let toastDescription = "";
      
      if (status === 'cancelled') {
        toastTitle = "Booking Cancelled";
        toastDescription = "Your booking has been cancelled successfully";
      } else if (status === 'accepted') {
        toastTitle = "Booking Accepted! 🎉";
        toastDescription = "Meeting room has been created for online sessions";
      } else if (status === 'rejected') {
        toastTitle = "Booking Declined";
        toastDescription = "The booking request has been declined";
      } else if (status === 'completed') {
        toastTitle = "Booking Completed";
        toastDescription = "The session has been marked as completed";
      } else if (comment !== undefined) {
        toastTitle = "Comment Updated";
        toastDescription = "Your note has been updated successfully";
      } else {
        toastTitle = "Update Successful";
        toastDescription = "Booking has been updated successfully";
      }
      
      toast({
        title: toastTitle,
        description: toastDescription,
      });

    } catch (error: any) {
      console.error("Error updating booking:", error);
      
      let errorMessage = "Failed to update booking";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    ...bookingsData,
    loading,
    sentError,
    receivedError,
    updatingStatus,
    joinMeeting,
    refetchBookings: fetchBookings,
    updateBookingStatus,
  };
};