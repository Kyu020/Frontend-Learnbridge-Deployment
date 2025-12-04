"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { PageLoader } from "@/components/ui/loading-spinner"
import { TutorHeader } from "@/components/tutors/TutorHeader"
import { Filters } from "@/components/tutors/Filters"
import { TutorTable } from "@/components/tutors/TutorTable"
import { TutorProfileDialog } from "@/components/tutors/TutorProfileDialog"
import { ScheduleDialog } from "@/components/tutors/ScheduleDialog"
import { EmptyState } from "@/components/tutors/EmptyState"
import { useTutorsData } from "@/hooks/useTutorsData"
import { useTutorSearch } from "@/hooks/useTutorSearch"
import { useMatchingTutors } from "@/hooks/useMatchingTutors"
import { useTutorCredibility } from "@/hooks/useTutorCredibility"
import { TutorFormData, ScheduleFormData } from "@/interfaces/tutors.interfaces"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/authContext" // Import the hook

export default function TutorsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [updatingFavorite, setUpdatingFavorite] = useState<string | null>(null)
  const [selectedTutor, setSelectedTutor] = useState<any>(null)
  const [credibilityScores, setCredibilityScores] = useState<Map<string, number>>(new Map())
  
  // FIXED: Use proper default values that match the interface
  const [createForm, setCreateForm] = useState<TutorFormData>({
    bio: "",
    course: "",
    hourlyRate: "",
    availability: "",
    availabilitySlots: [],
    credentials: "",
    teachingLevel: "beginner",
    teachingStyle: "interactive",
    modeOfTeaching: "online"
  })

  // FIXED: Use proper default values that match the interface
  const [editForm, setEditForm] = useState<TutorFormData>({
    bio: "",
    course: "",
    hourlyRate: "",
    availability: "",
    availabilitySlots: [],
    credentials: "",
    teachingLevel: "beginner", // Changed from "" to "beginner"
    teachingStyle: "interactive", // Changed from "" to "interactive"
    modeOfTeaching: "online"
  })

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    sessionDate: "",
    sessionTime: "",
    duration: "60",
    price: "",
    course: "",
    comment: "",
    modality: "online"
  })

  const {
    tutors,
    favorites,
    userTutorStatus,
    loading,
    toggleTutorMode,
    createTutorProfile,
    updateTutorProfile,
    scheduleSession,
    toggleFavorite,
  } = useTutorsData()

  const {
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    filteredTutors,
    clearFilters,
  } = useTutorSearch(tutors)

  const { matchedTutors } = useMatchingTutors()

  // Create score map from matched tutors
  const matchScores = new Map(
    matchedTutors.map(m => [m.tutor.studentId, Math.round((m.score / 100) * 100)])
  )

  // Fetch credibility scores for all tutors
  const fetchCredibilityScores = async () => {
    if (tutors.length === 0) {
      console.log('No tutors to fetch credibility for')
      return
    }
    
    console.log(`Fetching credibility for ${tutors.length} tutors`)
    const scores = new Map<string, number>()
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.warn('No token found in localStorage')
      return
    }
    
    try {
      for (const tutor of tutors) {
        try {
          const url = `http://localhost:5000/api/credibility/tutor/${tutor.studentId}`
          console.log(`Fetching credibility from: ${url}`)
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          
          console.log(`Response status for ${tutor.studentId}: ${response.status}`)
          
          if (response.ok) {
            const data = await response.json()
            console.log(`Credibility data for ${tutor.studentId}:`, data)
            
            if (data.success && data.credibility) {
              scores.set(tutor.studentId, data.credibility.score)
              console.log(`Set credibility score ${data.credibility.score} for ${tutor.studentId}`)
            }
          } else {
            console.error(`Failed to fetch credibility for ${tutor.studentId}: ${response.statusText}`)
          }
        } catch (err) {
          console.error(`Error fetching credibility for tutor ${tutor.studentId}:`, err)
        }
      }
      
      console.log(`Total credibility scores fetched: ${scores.size}`)
      setCredibilityScores(scores)
    } catch (err) {
      console.error('Error fetching credibility scores:', err)
    }
  }

  // Call fetchCredibilityScores when tutors load
  React.useEffect(() => {
    if (tutors.length > 0) {
      fetchCredibilityScores()
    }
  }, [tutors])

  // Sort filtered tutors by match score if available
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    const scoreA = matchScores.get(a.studentId) ?? 0
    const scoreB = matchScores.get(b.studentId) ?? 0
    return scoreB - scoreA
  })

  // Handler functions
  const handleCreateTutor = async () => {
    try {
      await createTutorProfile(createForm)
      setOpenCreateDialog(false)
      setCreateForm({
        bio: "",
        course: "",
        hourlyRate: "",
        availability: "",
        availabilitySlots: [],
        credentials: "",
        teachingLevel: "beginner",
        teachingStyle: "interactive",
        modeOfTeaching: "online"
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleUpdateTutor = async () => {
    try {
      await updateTutorProfile(editForm)
      setOpenEditDialog(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleOpenEditDialog = () => {
    if (userTutorStatus.userTutorProfile) {
      const profile = userTutorStatus.userTutorProfile;
      
      setEditForm({
        bio: profile.bio || "",
        course: Array.isArray(profile.course) 
          ? profile.course.join(", ") 
          : profile.course || "",
        hourlyRate: profile.hourlyRate?.toString() || "",
        availability: "",
        availabilitySlots: Array.isArray(profile.availabilitySlots) 
          ? profile.availabilitySlots 
          : [],
        credentials: profile.credentials || "",
        teachingLevel: profile.teachingLevel || "",
        teachingStyle: profile.teachingStyle || "",
        modeOfTeaching: profile.modeOfTeaching || "either"
      });
      setOpenEditDialog(true);
      
      toast({
        title: "Edit Profile",
        description: "Updating your tutor profile",
      });
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true)
    toast({
      title: "Create Tutor Profile",
      description: "Set up your tutoring profile"
    })
  }

  const handleToggleFavorite = async (tutorId: string) => {
    setUpdatingFavorite(tutorId)
    await toggleFavorite(tutorId)
    setUpdatingFavorite(null)
  }

  const handleOpenScheduleDialog = (tutor: any) => {
    setSelectedTutor(tutor)
    const defaultDuration = "60"
    const calculatedPrice = calculatePriceFromDuration(defaultDuration, tutor)
    
    setScheduleForm({
      sessionDate: "",
      sessionTime: "",
      duration: defaultDuration,
      price: calculatedPrice,
      course: tutor.course?.[0] || "",
      comment: "",
      modality: "online"
    })
    setOpenScheduleDialog(true)
    
    toast({
      title: "Schedule Session",
      description: `Scheduling with ${tutor.name}`,
    })
  }

  const handleScheduleSession = async () => {
    if (!selectedTutor) return

    try {
      await scheduleSession({
        ...scheduleForm,
        tutorId: selectedTutor.studentId
      })
      setOpenScheduleDialog(false)
      setSelectedTutor(null)
      setScheduleForm({ 
        sessionDate: "", 
        sessionTime
        : "", 
        duration: "60", 
        price: "", 
        course: "", 
        comment: "", 
        modality: "online"
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleViewProfile = (tutor: any) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${tutor.name}'s profile`,
    })
    router.push(`/tutors/${tutor.studentId}`)
  }

  // Utility functions
  const calculatePriceFromDuration = (duration: string, tutor?: any): string => {
    const currentTutor = tutor || selectedTutor
    if (!currentTutor || !duration) return "0"
    const durationInHours = parseInt(duration) / 60
    return (currentTutor.hourlyRate * durationInHours).toFixed(2)
  }

  const getMinDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMinTime = (): string => {
    if (scheduleForm.sessionDate === new Date().toISOString().split('T')[0]) {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return "00:00"
  }

  // Show loading if auth is still loading
  if (authLoading || loading) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      {/* Header Section */}
      <div className="mb-8">
        <TutorHeader
          userTutorStatus={userTutorStatus}
          onToggleTutorMode={toggleTutorMode}
          onEditProfile={handleOpenEditDialog}
          onCreateProfile={handleOpenCreateDialog}
        />
      </div>

      {/* Filters at Top */}
      <div className="mb-6">
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onClearFilters={clearFilters}
          resultCount={filteredTutors.length}
          totalCount={tutors.length}
          showMobileFilters={showMobileFilters}
          onMobileFiltersToggle={() => setShowMobileFilters(!showMobileFilters)}
        />
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'} found
        </h2>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-1">
            Search results for "{searchQuery}"
          </p>
        )}
      </div>

      {/* Tutors List */}
      <div>
        {sortedTutors.length > 0 ? (
          <TutorTable
            tutors={sortedTutors}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onScheduleSession={handleOpenScheduleDialog}
            onViewProfile={handleViewProfile}
            isUpdatingFavorite={updatingFavorite}
            matchScores={matchScores}
            showMatchScore={matchedTutors.length > 0}
            credibilityScores={credibilityScores}
            showCredibility={credibilityScores.size > 0}
          />
        ) : (
          <EmptyState 
            searchQuery={searchQuery}
            onClearFilters={clearFilters}
          />
        )}
      </div>

      {/* Create Tutor Dialog */}
      <TutorProfileDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        title="Create Tutor Profile"
        formData={createForm}
        onFormChange={setCreateForm}
        onSubmit={handleCreateTutor}
        loading={false}
      />

      {/* Edit Tutor Dialog */}
      <TutorProfileDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        title="Edit Tutor Profile"
        formData={editForm}
        onFormChange={setEditForm}
        onSubmit={handleUpdateTutor}
        loading={false}
        isEdit={true}
      />

      <ScheduleDialog
        open={openScheduleDialog}
        onOpenChange={setOpenScheduleDialog}
        tutor={selectedTutor} 
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        onSubmit={handleScheduleSession}
        loading={false}
        onCalculatePrice={(duration) => calculatePriceFromDuration(duration)}
        getMinDate={getMinDate}
        getMinTime={getMinTime}
      />
    </LayoutWrapper>
  )
}