"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { QuickStats } from "@/components/profile/QuickStats"
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab"
import { AchievementsTab } from "@/components/profile/AchievementTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/useProfile"
import { useAuth } from "@/contexts/authContext"

export default function ProfilePage() {
  const { refreshUser } = useAuth()
  const {
    isEditing,
    setIsEditing,
    isLoading,
    profile,
    editedProfile,
    availableInterests,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSave,
    handleInputChange,
    cancelEdit,
  } = useProfile()

  const handlePhotoUpdate = async (newPhotoUrl: string) => {
    // The photo upload already updates the backend
    // We just need to refresh the UI
    await refreshUser()
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  // Loading state
  if (isLoading && !profile) {
    return <ProfileLoading />
  }

  // Error state or no profile
  if (!profile) {
    return <ProfileError />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and track your progress</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Sidebar */}
            <div className="space-y-6">
              <ProfileHeader
                profile={profile}
                isEditing={isEditing}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onCancel={cancelEdit}
                onPhotoUpdate={handlePhotoUpdate}
              />
              <QuickStats profile={profile} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="info">
                <TabsList className="mb-6">
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <PersonalInfoTab
                    profile={profile}
                    isEditing={isEditing}
                    editedProfile={editedProfile}
                    availableInterests={availableInterests}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={cancelEdit}
                    onEditToggle={handleEditToggle}
                  />
                </TabsContent>

                <TabsContent value="achievements">
                  <AchievementsTab profile={profile} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Loading and Error components
const ProfileLoading = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 lg:pl-64">
      <Header />
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </main>
    </div>
  </div>
)

const ProfileError = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 lg:pl-64">
      <Header />
      <main className="p-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">Failed to load profile. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </main>
    </div>
  </div>
)