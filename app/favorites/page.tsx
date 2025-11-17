"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users } from "lucide-react"
import { useFavoritesData } from "@/hooks/useFavoritesData"
import { useFavoritesNavigation } from "@/hooks/useFavoritesNavigation"
import { LoadingState } from "@/components/favorites/LoadingState"
import { EmptyState } from "@/components/favorites/EmptyState"
import { ResourceCard } from "@/components/favorites/ResourceCard"
import { TutorCard } from "@/components/favorites/TutorCard"

export default function FavoritesPage() {
  const {
    favoriteResources,
    favoriteTutors,
    loading,
    removeFavorite,
  } = useFavoritesData()

  const {
    handleViewProfile,
    handleBookNow,
    handleViewResource,
    handleBrowseRedirect,
  } = useFavoritesNavigation()

  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemoveFavorite = async (favoriteId: string, tutorId?: string, resourceId?: string) => {
    try {
      setRemovingId(favoriteId)
      await removeFavorite(favoriteId, tutorId, resourceId)
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <LayoutWrapper>
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Favorites</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Resources and tutors you've saved for later
        </p>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-6 mx-4 sm:mx-0">
          <TabsTrigger value="resources" className="flex items-center gap-2 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4" />
            Resources ({favoriteResources.length})
          </TabsTrigger>
          <TabsTrigger value="tutors" className="flex items-center gap-2 text-xs sm:text-sm">
            <Users className="h-4 w-4" />
            Tutors ({favoriteTutors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {favoriteResources.length === 0 ? (
            <EmptyState 
              type="resources"
              onBrowse={() => handleBrowseRedirect('resources')}
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
              {favoriteResources.map((favorite) => (
                <ResourceCard
                  key={favorite._id}
                  favorite={favorite}
                  onRemove={handleRemoveFavorite}
                  onView={handleViewResource}
                  isRemoving={removingId === favorite._id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tutors" className="space-y-4">
          {favoriteTutors.length === 0 ? (
            <EmptyState 
              type="tutors"
              onBrowse={() => handleBrowseRedirect('tutors')}
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
              {favoriteTutors.map((favorite) => (
                <TutorCard
                  key={favorite._id}
                  favorite={favorite}
                  onRemove={handleRemoveFavorite}
                  onViewProfile={handleViewProfile}
                  onBookNow={handleBookNow}
                  isRemoving={removingId === favorite._id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  )
}