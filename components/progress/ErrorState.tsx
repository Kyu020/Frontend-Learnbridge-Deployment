import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
    <div className="text-destructive text-center">
      <p className="text-lg font-medium mb-2">Unable to Load Progress</p>
      <p className="text-sm">{error}</p>
    </div>
    <button 
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      Try Again
    </button>
    <p className="text-xs text-muted-foreground text-center">
      If this continues, check your connection and try again.
    </p>
  </div>
);