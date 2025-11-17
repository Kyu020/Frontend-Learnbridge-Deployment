import { LayoutWrapper } from "@/components/layout-wrapper";

export const LoadingState = () => (
  <LayoutWrapper>
    <div className="mb-6 px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Favorites</h1>
      <p className="text-sm sm:text-base text-muted-foreground">Loading your favorites...</p>
    </div>
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  </LayoutWrapper>
);