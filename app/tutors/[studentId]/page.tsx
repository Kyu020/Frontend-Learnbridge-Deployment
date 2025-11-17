// app/tutors/[studentId]/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

import { Tutor, Review, ScheduleFormData, ReviewFormData, TutorProfileData} from "@/interfaces/tutors.interfaces"
import { tutorProfileService } from "@/services/tutor-profile.service"
import { TutorProfileHeader } from "@/components/tutor-profile/TutorProfileHeader"
import { TutorSidebar } from "@/components/tutor-profile/TutorSidebar"
import { TutorInfoSection } from "@/components/tutor-profile/TutorInfoSection"
import { ReviewSection } from "@/components/tutor-profile/ReviewSection"
import { ScheduleDialog } from "@/components/tutors/ScheduleDialog"
import { ReviewDialog } from "@/components/tutor-profile/ReviewDialog"

export default function TutorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string
  
  const [tutor, setTutor] = useState<Tutor | null>(null)
  const [loading, setLoading] = useState(true)
  const [scheduleDialog, setScheduleDialog] = useState(false)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    sessionDate: "",
    sessionTime: "",
    duration: "60",
    price: "",
    course: "",
    comment: "",
    modality: "online"
  })
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    comment: ""
  })
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [addingFavorite, setAddingFavorite] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [deletingReview, setDeletingReview] = useState(false)

  // Load tutor profile
  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        if (!studentId) {
          toast({
            title: "Invalid Tutor ID",
            description: "No tutor ID provided in the URL",
            variant: "destructive"
          })
          setLoading(false)
          return
        }

        console.log("🔍 Fetching tutor profile for studentId:", studentId)
        
        toast({
          title: "Loading tutor profile...",
          description: "Please wait while we fetch the tutor information",
        })

        const response = await tutorProfileService.fetchTutorProfile(studentId)
        setTutor(response.data)
        
        toast({
          title: "Profile Loaded! 🎓",
          description: `Successfully loaded ${response.data.name}'s profile`,
        })
      } catch (err: any) {
        console.error("❌ Fetch tutor error:", err)
        
        if (err.message?.includes('404')) {
          toast({ 
            title: "Tutor Not Found", 
            description: "The tutor profile you're looking for doesn't exist", 
            variant: "destructive" 
          })
        } else {
          toast({ 
            title: "Error Loading Profile", 
            description: "Failed to load tutor profile. Please try again.", 
            variant: "destructive" 
          })
        }
        router.push("/tutors")
      } finally {
        setLoading(false)
      }
    }

    fetchTutorProfile()
  }, [studentId, router])

  // Load favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteTutorIds = await tutorProfileService.fetchFavorites()
        setFavorites(new Set(favoriteTutorIds))
      } catch (err) {
        console.error("❌ Fetch favorites error:", err)
      }
    }

    fetchFavorites()
  }, [])

  // Fetch reviews when tutor is loaded
  useEffect(() => {
    if (tutor) {
      fetchReviews()
    }
  }, [tutor])

  const fetchReviews = async () => {
    if (!tutor) return
    
    try {
      setReviewsLoading(true)
      const reviewsData = await tutorProfileService.fetchTutorReviews(tutor.studentId)
      setReviews(reviewsData)
      
      // Check if current user has already reviewed
      const currentUserId = localStorage.getItem("studentId")
      const existingUserReview = reviewsData.find((review: Review) => review.studentId === currentUserId)
      setUserReview(existingUserReview || null)
      
      if (existingUserReview) {
        setReviewForm({
          rating: existingUserReview.rating,
          comment: existingUserReview.comment
        })
      }
    } catch (err: any) {
      console.error("❌ Fetch reviews error:", err)
      setReviews([])
      setUserReview(null)
      
      if (!err.message?.includes('404') && !err.message?.includes('400')) {
        toast({
          title: "No Reviews Available",
          description: "Unable to load reviews at this time.",
        })
      }
    } finally {
      setReviewsLoading(false)
    }
  }

  // Auto-open booking if needed
  useEffect(() => {
    if (tutor) {
      const shouldOpenBooking = sessionStorage.getItem('autoOpenBooking') === 'true'
      if (shouldOpenBooking) {
        setScheduleDialog(true)
        sessionStorage.removeItem('autoOpenBooking')
        toast({
          title: "Schedule Session",
          description: `Ready to schedule with ${tutor.name}`,
        })
      }
    }
  }, [tutor])

  const toggleFavorite = async () => {
    if (!tutor) return
    
    const isCurrentlyFavorite = favorites.has(tutor.studentId)
    
    try {
      setAddingFavorite(true)
      if (isCurrentlyFavorite) {
        await tutorProfileService.removeFavorite(tutor.studentId)
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.delete(tutor.studentId)
          return newFavorites
        })
        toast({ 
          title: "Removed from Favorites", 
          description: "Tutor has been removed from your favorites list." 
        })
      } else {
        await tutorProfileService.addFavorite(tutor.studentId)
        setFavorites(prev => new Set(prev).add(tutor.studentId))
        toast({ 
          title: "Added to Favorites! ❤️", 
          description: "Tutor has been added to your favorites list!" 
        })
      }
    } catch (err: any) {
      console.error("❌ Favorite toggle error:", err)
      toast({ 
        title: "Error", 
        description: "Failed to update favorites. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setAddingFavorite(false)
    }
  }

  const handleOpenScheduleDialog = () => {
    if (!tutor) return
    const defaultDuration = "60"
    const calculatedPrice = calculatePriceFromDuration(defaultDuration)
    
    setScheduleForm({
      sessionDate: "",
      sessionTime: "",
      duration: defaultDuration,
      price: calculatedPrice,
      course: tutor.course[0] || "",
      comment: "",
      modality:"online"
    })
    setScheduleDialog(true)
    
    toast({
      title: "Schedule Session",
      description: `You are now scheduling a session with ${tutor.name}`,
    })
  }

  const handleScheduleSession = async () => {
    if (!tutor) return

    // Validate all required fields
    if (!scheduleForm.sessionDate || !scheduleForm.sessionTime || !scheduleForm.duration || !scheduleForm.price || !scheduleForm.course) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill in all required fields (Date, Time, Duration, Subject).", 
        variant: "destructive" 
      })
      return
    }

    // Validate numeric fields
    const duration = parseInt(scheduleForm.duration)
    const price = parseFloat(scheduleForm.price)
    
    if (isNaN(duration) || duration < 1) {
      toast({ 
        title: "Invalid Duration", 
        description: "Duration must be at least 1 minute.", 
        variant: "destructive" 
      })
      return
    }

    if (isNaN(price) || price <= 0) {
      toast({ 
        title: "Invalid Price", 
        description: "Price must be a positive number.", 
        variant: "destructive" 
      })
      return
    }

    const selectedDateTime = new Date(`${scheduleForm.sessionDate}T${scheduleForm.sessionTime}`)
    const now = new Date()
    
    if (selectedDateTime <= now) {
      toast({ 
        title: "Invalid Date/Time", 
        description: "Please select a future date and time for your session.", 
        variant: "destructive" 
      })
      return
    }

    setScheduling(true)
    try {
      await tutorProfileService.scheduleSession({
        ...scheduleForm,
        tutorId: tutor.studentId
      })
      
      toast({ 
        title: "Request Sent Successfully! ✅", 
        description: `Your tutoring request has been sent to ${tutor.name}. They will respond shortly.` 
      })
      setScheduleDialog(false)
      setScheduleForm({ 
        sessionDate: "", 
        sessionTime: "", 
        duration: "60", 
        price: "", 
        course: "", 
        comment: "",
        modality: "online"
      })
    } catch (err: any) {
      console.error("❌ Schedule session error:", err)
      const errorMessage = err.message || "Failed to schedule session. Please try again."
      toast({ 
        title: "Error Sending Request", 
        description: errorMessage, 
        variant: "destructive" 
      })
    } finally {
      setScheduling(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!tutor) return

    if (!reviewForm.comment.trim()) {
      toast({
        title: "Review Required 📝",
        description: "Please write a review comment before submitting",
        variant: "destructive"
      })
      return
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast({
        title: "Invalid Rating ⭐",
        description: "Please select a rating between 1 and 5 stars",
        variant: "destructive"
      })
      return
    }

    setSubmittingReview(true)
    try {
      await tutorProfileService.submitReview({
        ...reviewForm,
        tutorId: tutor.studentId
      })

      toast({
        title: userReview ? "Review Updated Successfully! ✅" : "Review Submitted Successfully! 🎉",
        description: userReview 
          ? "Your review has been updated and is now visible to others" 
          : `Thank you for reviewing ${tutor.name}! Your feedback helps other students.`
      })
      setReviewDialog(false)
      // Refresh reviews
      await fetchReviews()
      // Reset form if it was a new review
      if (!userReview) {
        setReviewForm({
          rating: 5,
          comment: ""
        })
      }
    } catch (err: any) {
      console.error("❌ Submit review error:", err)
      
      let errorTitle = "Error Submitting Review"
      let errorDescription = err.message || "Failed to submit review. Please try again."
      
      if (err.message?.includes('403')) {
        errorTitle = "Session Required 📚"
        errorDescription = "You need to complete a session with this tutor before leaving a review."
      } else if (err.message?.includes('cannot review yourself')) {
        errorTitle = "Cannot Review Yourself 🙅‍♂️"
        errorDescription = "You cannot leave a review for your own tutor profile."
      } else if (err.message?.includes('authentication')) {
        errorTitle = "Authentication Required 🔐"
        errorDescription = "Please log in to submit a review."
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleOpenReviewDialog = () => {
    if (!tutor) return
    
    if (userReview) {
      toast({
        title: "Editing Your Review ✏️",
        description: "You're updating your existing review for this tutor",
      })
    } else {
      toast({
        title: "Writing a Review 📝",
        description: `Share your experience with ${tutor.name}`,
      })
    }
    setReviewDialog(true)
  }

  const handleRatingChange = (newRating: number) => {
    setReviewForm({ ...reviewForm, rating: newRating })
    
    const ratingMessages = {
      1: "Poor - Very dissatisfied",
      2: "Fair - Could be better", 
      3: "Good - Met expectations",
      4: "Very Good - Exceeded expectations",
      5: "Excellent - Outstanding experience"
    }
    
    toast({
      title: `${newRating} Star${newRating !== 1 ? 's' : ''} Selected ⭐`,
      description: ratingMessages[newRating as keyof typeof ratingMessages],
      duration: 2000
    })
  }

  const handleDeleteReview = async () => {
    if (!tutor || !userReview) return

    const confirmDelete = window.confirm("Are you sure you want to delete your review? This action cannot be undone.")
    if (!confirmDelete) {
      toast({
        title: "Deletion Cancelled",
        description: "Your review was not deleted",
      })
      return
    }

    setDeletingReview(true)
    try {
      await tutorProfileService.deleteReview(tutor.studentId)

      toast({
        title: "Review Deleted Successfully ✅",
        description: "Your review has been removed from the tutor's profile"
      })
      setUserReview(null)
      setReviewForm({
        rating: 5,
        comment: ""
      })
      await fetchReviews()
    } catch (err: any) {
      console.error("❌ Delete review error:", err)
      
      let errorTitle = "Error Deleting Review"
      let errorDescription = err.message || "Failed to delete review. Please try again."
      
      if (err.message?.includes('404')) {
        errorTitle = "Review Not Found"
        errorDescription = "The review you're trying to delete doesn't exist or has already been removed."
      } else if (err.message?.includes('authentication')) {
        errorTitle = "Authentication Required"
        errorDescription = "Please log in to delete your review."
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      })
    } finally {
      setDeletingReview(false)
    }
  }

  const handleBackToTutors = () => {
    toast({
      title: "Returning to Tutors",
      description: "Taking you back to the tutors list",
    })
    router.push("/tutors")
  }

  // Get minimum date for date input (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get minimum time for time input (if date is today)
  const getMinTime = () => {
    if (scheduleForm.sessionDate === new Date().toISOString().split('T')[0]) {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return "00:00"
  }

  // Calculate price based on duration
  const calculatePriceFromDuration = (duration: string) => {
    if (!tutor || !duration) return "0"
    const durationInHours = parseInt(duration) / 60
    return (tutor.hourlyRate * durationInHours).toFixed(2)
  }

  const handleCancelSchedule = () => {
    setScheduleDialog(false)
    toast({
      title: "Scheduling Cancelled",
      description: "Session scheduling has been cancelled",
    })
  }

  const handleCancelReview = () => {
    setReviewDialog(false)
    // Reset form if user was creating a new review
    if (!userReview) {
      setReviewForm({
        rating: 5,
        comment: ""
      })
    }
    toast({
      title: "Review Cancelled",
      description: "Review editing has been cancelled",
    })
  }

  // Calculate average rating
  const averageRating = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((total: number, review: Review) => total + review.rating, 0)
    const avg = sum / reviews.length
    return Number(avg.toFixed(1))
  }, [reviews])

  // Count ratings
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter((review: Review) => review.rating === rating).length
  }))

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tutor profile...</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!tutor) {
    return (
      <LayoutWrapper>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Tutor Not Found</h1>
          <p className="text-muted-foreground mb-6">The tutor profile you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={handleBackToTutors}>
            Back to Tutors
          </Button>
        </div>
      </LayoutWrapper>
    )
  }

  const isFavorite = favorites.has(tutor.studentId)

  return (
    <LayoutWrapper>
      <div className="p-4 lg:p-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackToTutors}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutors
        </Button>

        {/* Schedule Dialog */}
        <ScheduleDialog
          open={scheduleDialog}
          onOpenChange={setScheduleDialog}
          tutor={tutor}
          formData={scheduleForm}
          onFormChange={setScheduleForm}
          onSubmit={handleScheduleSession}
          loading={scheduling}
          onCalculatePrice={calculatePriceFromDuration}
          getMinDate={getMinDate}
          getMinTime={getMinTime}
        />

        {/* Review Dialog */}
        <ReviewDialog
          open={reviewDialog}
          onOpenChange={setReviewDialog}
          tutor={tutor}
          userReview={userReview}
          formData={reviewForm}
          onFormChange={setReviewForm}
          onRatingChange={handleRatingChange}
          onSubmit={handleSubmitReview}
          onDelete={handleDeleteReview}
          loading={submittingReview}
          deleting={deletingReview}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <TutorProfileHeader
              tutor={tutor}
              isFavorite={isFavorite}
              averageRating={averageRating}
              reviewsCount={reviews.length}
              onToggleFavorite={toggleFavorite}
              onScheduleSession={handleOpenScheduleDialog}
              onOpenReview={handleOpenReviewDialog}
              addingFavorite={addingFavorite}
            />

            {/* Reviews Section */}
            <ReviewSection
              reviews={reviews}
              userReview={userReview}
              averageRating={averageRating}
              ratingCounts={ratingCounts}
              reviewsLoading={reviewsLoading}
              onOpenReview={handleOpenReviewDialog}
              onEditReview={handleOpenReviewDialog}
              onDeleteReview={handleDeleteReview}
              deletingReview={deletingReview}
            />

            {/* Tutor Info Section */}
            <TutorInfoSection tutor={tutor} />
          </div>

          {/* Sidebar */}
          <TutorSidebar
            tutor={tutor}
            isFavorite={isFavorite}
            averageRating={averageRating}
            reviewsCount={reviews.length}
            onScheduleSession={handleOpenScheduleDialog}
            onToggleFavorite={toggleFavorite}
            onOpenReview={handleOpenReviewDialog}
            addingFavorite={addingFavorite}
          />
        </div>
      </div>
    </LayoutWrapper>
  )
}