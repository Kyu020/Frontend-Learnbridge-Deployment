// components/bookings/TutorRegistrationMessage.tsx
import { AlertCircle } from "lucide-react";

export const TutorRegistrationMessage = () => {
  return (
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg mx-4 sm:mx-6 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">Tutor Registration Required</h3>
          <p className="text-yellow-700 text-xs sm:text-sm mt-1">
            Register as a tutor to start receiving booking requests from students.
          </p>
        </div>
      </div>
    </div>
  );
};