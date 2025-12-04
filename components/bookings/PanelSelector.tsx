// components/bookings/PanelSelector.tsx
import { Calendar } from "lucide-react";

interface PanelSelectorProps {
  activePanel: "sent" | "received";
  onPanelChange: (panel: "sent" | "received") => void;
  sentCount: number;
  receivedCount: number;
  isTutor: boolean;
  upcomingCount?: number;
}

export function PanelSelector({ 
  activePanel, 
  onPanelChange, 
  sentCount, 
  receivedCount, 
  isTutor,
  upcomingCount = 0 
}: PanelSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onPanelChange("sent")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activePanel === "sent"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sent Requests
          {sentCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
              {sentCount}
            </span>
          )}
        </button>
        
        {isTutor && (
          <button
            onClick={() => onPanelChange("received")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activePanel === "received"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Received Requests
            {receivedCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
                {receivedCount}
              </span>
            )}
          </button>
        )}
      </div>
      
      {/* Session stats */}
      {upcomingCount > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full">
            <Calendar className="w-4 h-4" />
            <span>{upcomingCount} upcoming sessions</span>
          </div>
        </div>
      )}
    </div>
  );
}