interface EmptyStateProps {
  onRetry: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <p className="text-muted-foreground text-lg">No Progress Data Available</p>
    <p className="text-sm text-muted-foreground text-center">
      Start learning to see your progress here!
    </p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Check Again
    </button>
  </div>
);