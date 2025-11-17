// components/bookings/BookingsTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Send } from "lucide-react";
import { Booking } from '@/interfaces/bookings.interfaces';

interface BookingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activePanel: "sent" | "received";
  currentBookings: Booking[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateStatus?: (id: string, status: Booking["status"], tutorComment?: string) => void;
  updatingStatus?: boolean;
  renderBookingCard: (booking: Booking) => React.ReactNode;
}

export const BookingsTabs = ({
  activeTab,
  onTabChange,
  activePanel,
  currentBookings,
  loading,
  error,
  onRefresh,
  onUpdateStatus,
  updatingStatus = false,
  renderBookingCard
}: BookingsTabsProps) => {
  const filteredBookings = (status: Booking["status"]) =>
    currentBookings.filter((b) => b.status === status);

  const renderTab = (status: Booking["status"]) => {
    const list = filteredBookings(status);
    
    if (loading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState error={error} onRetry={onRefresh} />;
    }

    if (list.length === 0) {
      return <EmptyState status={status} activePanel={activePanel} />;
    }
    
    return (
      <div className="space-y-4">
        {list.map((booking) => renderBookingCard(booking))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mx-4 sm:mx-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="w-full overflow-x-auto flex justify-start p-1 sm:p-2 bg-white scrollbar-hide">
            <div className="flex gap-1 min-w-max">
              {["pending", "accepted", "completed", "rejected", "cancelled"].map((status) => (
                <TabsTrigger 
                  key={status}
                  value={status} 
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 whitespace-nowrap"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredBookings(status as Booking["status"]).length})
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
        </div>

        <div className="p-4 sm:p-6">
          {["pending", "accepted", "completed", "rejected", "cancelled"].map((status) => (
            <TabsContent key={status} value={status} className="mt-0 space-y-4">
              {renderTab(status as Booking["status"])}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

// Sub-components for different states
const LoadingState = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 mb-4"></div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">Loading bookings...</h3>
      <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
    </CardContent>
  </Card>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="h-12 w-12 text-red-500 mb-4">⚠️</div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">Error Loading Bookings</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

const EmptyState = ({ status, activePanel }: { status: string; activePanel: "sent" | "received" }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <Send className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        No {status} {activePanel === "received" ? "received" : "sent"} bookings
      </h3>
      <p className="text-sm text-muted-foreground text-center">
        {activePanel === "received" 
          ? "You don't have any booking requests in this status"
          : "You haven't sent any booking requests in this status"
        }
      </p>
    </CardContent>
  </Card>
);