export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <p className="text-muted-foreground">Loading your progress data...</p>
    <p className="text-sm text-muted-foreground">This may take a moment</p>
  </div>
);