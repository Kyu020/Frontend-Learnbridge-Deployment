// components/tutor-profile/ReviewDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2 } from "lucide-react";
import { Review, Tutor, ReviewFormData } from '@/interfaces/tutors.interfaces';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: Tutor;
  userReview: Review | null;
  formData: ReviewFormData;
  onFormChange: (data: ReviewFormData) => void;
  onRatingChange: (rating: number) => void;
  onSubmit: () => void;
  onDelete: () => void;
  loading: boolean;
  deleting: boolean;
}

export const ReviewDialog = ({
  open,
  onOpenChange,
  tutor,
  userReview,
  formData,
  onFormChange,
  onRatingChange,
  onSubmit,
  onDelete,
  loading,
  deleting
}: ReviewDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {userReview ? "Edit Your Review" : "Write a Review for " + tutor.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 ${
                    star <= formData.rating
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                  onClick={() => onRatingChange(star)}
                >
                  <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.rating} out of 5 stars - {
                formData.rating === 1 ? "Poor" :
                formData.rating === 2 ? "Fair" :
                formData.rating === 3 ? "Good" :
                formData.rating === 4 ? "Very Good" : "Excellent"
              }
            </p>
          </div>

          <div>
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => onFormChange({...formData, comment: e.target.value})}
              placeholder="Share your experience with this tutor. What did you like? What could be improved?"
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your review will help other students make informed decisions.
            </p>
          </div>

          {userReview && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Danger Zone</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                You can delete your review if you no longer want it to be visible.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                onClick={onDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Review"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div>
            {userReview && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(userReview.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Submitting..." : (userReview ? "Update Review" : "Submit Review")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};