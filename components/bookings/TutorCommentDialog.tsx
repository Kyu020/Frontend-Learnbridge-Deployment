// components/bookings/TutorCommentDialog.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Booking } from '@/interfaces/bookings.interfaces';

interface TutorCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  pendingStatus: Booking["status"] | null;
  onConfirm: (tutorComment: string) => void;
  onCancel: () => void; // Add this line
  loading?: boolean;
}

export const TutorCommentDialog = ({
  open,
  onOpenChange,
  booking,
  pendingStatus,
  onConfirm,
  onCancel, // Add this line
  loading = false
}: TutorCommentDialogProps) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setComment("");
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(comment);
  };

  const handleCancel = () => {
    onCancel(); // Call the onCancel prop
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (pendingStatus) {
      case "rejected":
        return "Reject Booking";
      case "accepted":
        return "Accept Booking";
      case "completed":
        return "Mark as Completed";
      default:
        return "Add Comment";
    }
  };

  const getDialogDescription = () => {
    switch (pendingStatus) {
      case "rejected":
        return "Please provide a reason for rejecting this booking request.";
      case "accepted":
        return "You can add an optional comment for the student when accepting this booking.";
      case "completed":
        return "Add any final comments before marking this session as completed.";
      default:
        return "Please add your comment.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {getDialogDescription()}
          </p>
          
          <Textarea
            placeholder="Enter your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (pendingStatus === "rejected" && !comment.trim())}
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};