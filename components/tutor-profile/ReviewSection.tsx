import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Star, Edit, Trash2 } from "lucide-react";
import { Review } from '@/interfaces/tutors.interfaces';

interface ReviewSectionProps {
  reviews: Review[];
  userReview: Review | null;
  averageRating: number;
  ratingCounts: Array<{ rating: number; count: number }>;
  reviewsLoading: boolean;
  onOpenReview: () => void;
  onEditReview: () => void;
  onDeleteReview: () => void;
  deletingReview: boolean;
}

export const ReviewSection = ({
  reviews,
  userReview,
  averageRating,
  ratingCounts,
  reviewsLoading,
  onOpenReview,
  onEditReview,
  onDeleteReview,
  deletingReview
}: ReviewSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Rating Breakdown */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              Rating Breakdown
            </h2>
            <div className="space-y-2">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium w-4">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ 
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Student Reviews ({reviews.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={userReview ? onEditReview : onOpenReview}
              className="flex items-center gap-2 w-fit"
            >
              <Edit className="h-4 w-4" />
              {userReview ? "Edit Review" : "Write Review"}
            </Button>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No reviews yet</p>
              <p className="text-muted-foreground mb-4">Be the first to review this tutor</p>
              <Button onClick={onOpenReview}>
                Write First Review
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  isUserReview={userReview?._id === review._id}
                  onEdit={onEditReview}
                  onDelete={onDeleteReview}
                  deleting={deletingReview && userReview?._id === review._id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Individual Review Card Component
const ReviewCard = ({ 
  review, 
  isUserReview, 
  onEdit, 
  onDelete, 
  deleting 
}: { 
  review: Review;
  isUserReview: boolean;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) => (
  <div className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blue-100 text-blue-800">
            {review.studentName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{review.studentName}</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground sm:text-right">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
    <p className="text-foreground leading-relaxed break-words">{review.comment}</p>
    
    {isUserReview && (
      <div className="flex items-center gap-2 mt-3">
        <Badge variant="outline" className="text-xs">
          Your Review
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-6 px-2 text-xs"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={deleting}
          className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    )}
  </div>
);