"use client"

import { useState } from "react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/ui/loading-spinner"
import { UploadDialog } from "@/components/resources/UploadDialog"
import { SearchBar } from "@/components/resources/SearchBar"
import { ResourceCard } from "@/components/resources/ResourceCard"
import { EmptyState } from "@/components/resources/EmptyState"
import { useResourcesData } from "@/hooks/useResourcesData"
import { useResourceSearch } from "@/hooks/useResourceSearch"
import { resourcesService } from "@/services/resources.service"
import { useToast } from "@/hooks/use-toast"

export default function ResourcesPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [updatingFavorite, setUpdatingFavorite] = useState<string | null>(null);
  const [recordingView, setRecordingView] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    resources, 
    favorites, 
    loading, 
    addResource, 
    toggleFavorite 
  } = useResourcesData();
  
  const {
    searchQuery,
    setSearchQuery,
    filteredResources,
    clearSearch
  } = useResourceSearch(resources);

  const handleResourceUploaded = (resource: any) => {
    addResource(resource);
  };

  const handleToggleFavorite = async (resourceId: string) => {
    setUpdatingFavorite(resourceId);
    await toggleFavorite(resourceId);
    setUpdatingFavorite(null);
  };

  const handleRecordView = async (resourceId: string) => {
    setRecordingView(resourceId);
    try {
      // Call the endpoint that records the view and returns file data
      const resourceData = await resourcesService.recordResourceView(resourceId);
      
      // If your backend returns an updated file URL, you could use it here
      console.log('Resource view recorded:', resourceData);
      
      // You could update the resource in local state if needed
      // updateResourceInState(resourceData);
      
    } catch (error) {
      console.error('Failed to record resource view:', error);
      toast({
        title: "Error",
        description: "Failed to record view",
        variant: "destructive"
      });
      throw error; // Re-throw to handle in ResourceCard
    } finally {
      setRecordingView(null);
    }
  };

  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <PageLoader />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            All Resources
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore our comprehensive learning materials
          </p>
        </div>

        <UploadDialog 
          onResourceUploaded={handleResourceUploaded}
        />
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
        resultCount={filteredResources.length}
        totalCount={resources.length}
      />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              isFavorite={favorites.has(resource._id)}
              onToggleFavorite={handleToggleFavorite}
              isUpdatingFavorite={updatingFavorite === resource._id}
              onRecordView={handleRecordView}
            />
          ))
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            onUploadClick={handleOpenUploadDialog}
            onClearSearch={clearSearch}
          />
        )}
      </div>

      {/* Load More Section for larger datasets */}
      {filteredResources.length > 0 && filteredResources.length < resources.length && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="mx-auto">
            Load More Resources
          </Button>
        </div>
      )}
    </LayoutWrapper>
  );
}