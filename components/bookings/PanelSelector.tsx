// components/bookings/PanelSelector.tsx
import { Badge } from "@/components/ui/badge";
import { Send, User } from "lucide-react";

interface PanelSelectorProps {
  activePanel: "sent" | "received";
  onPanelChange: (panel: "sent" | "received") => void;
  sentCount: number;
  receivedCount: number;
  isTutor: boolean;
}

export const PanelSelector = ({
  activePanel,
  onPanelChange,
  sentCount,
  receivedCount,
  isTutor
}: PanelSelectorProps) => {
  return (
    <div className="mb-6 bg-white rounded-lg border border-gray-200 mx-4 sm:mx-6">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide p-1">
        <button
          onClick={() => onPanelChange("sent")}
          className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex-shrink-0 text-sm sm:text-base min-w-max ${
            activePanel === "sent"
              ? "bg-green-500 text-white font-semibold shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span className="whitespace-nowrap">Sent</span>
            <Badge variant="secondary" className="ml-1 text-xs bg-white/20 text-white">
              {sentCount}
            </Badge>
          </div>
        </button>
        
        {isTutor && (
          <button
            onClick={() => onPanelChange("received")}
            className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex-shrink-0 text-sm sm:text-base min-w-max ${
              activePanel === "received"
                ? "bg-blue-500 text-white font-semibold shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="whitespace-nowrap">Received</span>
              <Badge variant="secondary" className="ml-1 text-xs bg-white/20 text-white">
                {receivedCount}
              </Badge>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};