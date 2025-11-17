import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface BookingsHeaderProps {
  onRefresh: () => void;
  refreshing?: boolean;
}

export const BookingsHeader = ({ onRefresh, refreshing = false }: BookingsHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">My Bookings</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your tutoring sessions and requests</p>
      </div>
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        size="sm" 
        className="w-full sm:w-auto shrink-0"
        disabled={refreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
};