// components/tutors/ScheduleDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tutor, ScheduleFormData } from '@/interfaces/tutors.interfaces';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: Tutor | null; // Allow tutor to be null
  formData: ScheduleFormData;
  onFormChange: (data: ScheduleFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  onCalculatePrice: (duration: string) => string;
  getMinDate: () => string;
  getMinTime: () => string;
}

export const ScheduleDialog = ({
  open,
  onOpenChange,
  tutor,
  formData,
  onFormChange,
  onSubmit,
  loading,
  onCalculatePrice,
  getMinDate,
  getMinTime
}: ScheduleDialogProps) => {

  // Validation constants
  const MINIMUM_DURATION = 60; // 1 hour in minutes
  const MAXIMUM_DURATION = 480; // 8 hours in minutes
  const MIN_HOURS = MINIMUM_DURATION / 60; // 1 hour
  const MAX_HOURS = MAXIMUM_DURATION / 60; // 8 hours

  // Helper function to get day of week from date string (YYYY-MM-DD)
  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];  
    return days[date.getDay()];
  };

  // Helper function to format time as HH:mm
  const formatTime = (timeString: string): string => {
    // timeString is already in HH:mm format from input
    return timeString;
  };

  // Check if selected time falls within tutor's available slots
  const isTimeWithinAvailableSlot = (date: string, time: string): boolean => {
    if (!tutor?.availabilitySlots || !date || !time) return false;

    const dayOfWeek = getDayOfWeek(date);
    const [selectedHour, selectedMin] = time.split(':').map(Number);
    const selectedTotalMins = selectedHour * 60 + selectedMin;

    // Check if any available slot matches this day and time
    return tutor.availabilitySlots.some(slot => {
      // Only check active slots
      if (!slot.isActive) return false;
      
      // Check if day matches
      if (slot.dayOfWeek !== dayOfWeek) return false;

      // Parse start and end times
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      
      const startTotalMins = startHour * 60 + startMin;
      const endTotalMins = endHour * 60 + endMin;

      // Check if selected time is within this slot
      return selectedTotalMins >= startTotalMins && selectedTotalMins < endTotalMins;
    });
  };

  // Check if session fits within available slot (start time + duration <= end time)
  const doesSessionFitInSlot = (date: string, time: string, durationMins: number): boolean => {
    if (!tutor?.availabilitySlots || !date || !time) return false;

    const dayOfWeek = getDayOfWeek(date);
    const [selectedHour, selectedMin] = time.split(':').map(Number);
    const selectedTotalMins = selectedHour * 60 + selectedMin;
    const sessionEndMins = selectedTotalMins + durationMins;

    // Check if session fits within any available slot
    return tutor.availabilitySlots.some(slot => {
      if (!slot.isActive || slot.dayOfWeek !== dayOfWeek) return false;

      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      
      const startTotalMins = startHour * 60 + startMin;
      const endTotalMins = endHour * 60 + endMin;

      // Session must start within slot and end before or at slot end
      return selectedTotalMins >= startTotalMins && sessionEndMins <= endTotalMins;
    });
  };

  // Get available time slots for a specific date
  const getAvailableTimesForDate = (date: string): Array<{ start: string; end: string }> => {
    if (!tutor?.availabilitySlots || !date) return [];

    const dayOfWeek = getDayOfWeek(date);
    return tutor.availabilitySlots
      .filter(slot => slot.isActive && slot.dayOfWeek === dayOfWeek)
      .map(slot => ({ start: slot.startTime, end: slot.endTime }));
  };

  // Get minimum available time for a date
  const getMinTimeForDate = (date: string): string => {
    const availableTimes = getAvailableTimesForDate(date);
    if (availableTimes.length === 0) return "00:00";
    
    // Return the earliest available time
    return availableTimes.reduce((min, slot) => 
      slot.start < min ? slot.start : min, availableTimes[0].start
    );
  };

  // Get maximum available time for a date
  const getMaxTimeForDate = (date: string): string => {
    const availableTimes = getAvailableTimesForDate(date);
    if (availableTimes.length === 0) return "23:59";
    
    // Return the latest available end time
    return availableTimes.reduce((max, slot) => 
      slot.end > max ? slot.end : max, availableTimes[0].end
    );
  };

  // Get validation error messages for time/date
  const getTimeError = (): string => {
    if (!formData.sessionDate || !formData.sessionTime) return "";

    const availableSlots = getAvailableTimesForDate(formData.sessionDate);
    if (availableSlots.length === 0) {
      return `Tutor is not available on ${getDayOfWeek(formData.sessionDate).charAt(0).toUpperCase() + getDayOfWeek(formData.sessionDate).slice(1)}`;
    }

    if (!isTimeWithinAvailableSlot(formData.sessionDate, formData.sessionTime)) {
      const timeRanges = availableSlots.map(s => `${s.start}-${s.end}`).join(", ");
      return `Selected time must be within available hours: ${timeRanges}`;
    }

    const durationNum = parseInt(formData.duration);
    if (!isNaN(durationNum) && !doesSessionFitInSlot(formData.sessionDate, formData.sessionTime, durationNum)) {
      const timeRanges = availableSlots.map(s => `${s.start}-${s.end}`).join(", ");
      return `Session duration doesn't fit within available slot. Available: ${timeRanges}`;
    }

    return "";
  };

  const isValidDuration = (duration: string): boolean => {
    const durationNum = parseInt(duration);
    return !isNaN(durationNum) && durationNum >= MINIMUM_DURATION && durationNum <= MAXIMUM_DURATION;
  };

  const getDurationError = (): string => {
    const durationNum = parseInt(formData.duration);
    if (!formData.duration || isNaN(durationNum)) {
      return "Duration is required";
    }
    if (durationNum < MINIMUM_DURATION) {
      return `Minimum session duration is ${MIN_HOURS} hour`;
    }
    if (durationNum > MAXIMUM_DURATION) {
      return `Maximum session duration is ${MAX_HOURS} hours per day`;
    }
    return "";
  };

  const isTutorAvailable = (): boolean => {
    // Check if tutor has explicitly set isTutor to false
    if (tutor?.isTutor === false) {
      return false;
    }
    // Check if tutor has at least one active availability slot
    if (!tutor?.availabilitySlots || tutor.availabilitySlots.length === 0) {
      return false;
    }
    return true;
  };

  const isFormValid = (): boolean => {
    return (
      isTutorAvailable() &&
      formData.sessionDate.trim() !== "" &&
      formData.sessionTime.trim() !== "" &&
      isValidDuration(formData.duration) &&
      formData.course.trim() !== "" &&
      getTimeError() === "" // All time validations pass
    );
  };

  // Get available days (next 14 days) that match tutor's schedule
  const getAvailableDays = () => {
    const days = [];
    const today = new Date();
    
    // Get the tutor's available days from availabilitySlots
    const availableDaysSet = new Set<string>();
    if (tutor?.availabilitySlots) {
      tutor.availabilitySlots.forEach(slot => {
        if (slot.isActive) {
          availableDaysSet.add(slot.dayOfWeek);
        }
      });
    }
    
    // Check next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = getDayOfWeek(dateString);
      
      // Only include if this day is in tutor's availability
      if (availableDaysSet.has(dayOfWeek)) {
        const availableSlots = getAvailableTimesForDate(dateString);
        
        // Only add if there are actually available slots for this date
        if (availableSlots.length > 0) {
          days.push({
            date: dateString,
            dayOfWeek,
            dayName: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            availableSlots
          });
        }
      }
    }
    
    return days;
  };

  const availableDays = getAvailableDays();


  // Get week of available slots
  const getWeekAvailability = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = getDayOfWeek(dateString);
      const availableSlots = getAvailableTimesForDate(dateString);
      
      days.push({
        date: dateString,
        dayOfWeek,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        availableSlots
      });
    }
    
    return days;
  };

  const handleSelectSlot = (date: string, startTime: string) => {
    onFormChange({
      ...formData,
      sessionDate: date,
      sessionTime: startTime
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  // Don't render if tutor is null - return null, not an empty string
  if (!tutor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Book with {tutor.name}</DialogTitle>
        </DialogHeader>

        {!isTutorAvailable() && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ⚠️ This tutor is not currently available
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Modality Selection */}
          <div>
            <Label className="text-sm">Session Type *</Label>
            <RadioGroup 
              value={formData.modality} 
              onValueChange={(value: 'online' | 'in-person') => 
                onFormChange({...formData, modality: value})
              }
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="text-sm cursor-pointer">🎥 Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="text-sm cursor-pointer">📍 In-Person</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="course" className="text-sm">Subject *</Label>
            <Select 
              value={formData.course} 
              onValueChange={(value) => onFormChange({...formData, course: value})}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {tutor.course.map((subject) => (
                  <SelectItem key={subject} value={subject} className="text-sm">
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Week Availability Selector */}
          <div>
            <Label className="text-sm mb-2 block">Pick a Slot *</Label>
            
            {availableDays.length === 0 ? (
              <div className="p-4 text-center bg-gray-50 rounded border">
                <p className="text-sm text-gray-600">No available slots in the next two weeks</p>
                <p className="text-xs text-gray-500 mt-1">Check back later or contact the tutor</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                {availableDays.map((day) => (
                  <div key={day.date} className="flex flex-col gap-1">
                    <div className="text-xs font-semibold text-center text-gray-600 truncate px-1">
                      {day.dayName}
                    </div>
                    <div className="flex flex-col gap-1">
                      {day.availableSlots.length > 0 ? (
                        day.availableSlots.map((slot, idx) => (
                          <button
                            key={`${day.date}-${idx}`}
                            type="button"
                            onClick={() => handleSelectSlot(day.date, slot.start)}
                            className={`text-xs py-1 px-1 rounded font-medium transition-colors ${
                              formData.sessionDate === day.date && formData.sessionTime === slot.start
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
                            }`}
                          >
                            {slot.start}
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 text-center py-1">—</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {formData.sessionDate && formData.sessionTime && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Selected: {formData.sessionDate} @ {formData.sessionTime}
              </p>
            )}
          </div>

          {getTimeError() && (
            <div className="p-2 bg-red-50 rounded border border-red-200 text-sm text-red-700">
              ⚠️ {getTimeError()}
            </div>
          )}


          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="duration" className="text-sm">Duration (min) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => {
                  // Limit input to 4 characters (max 9999 minutes = ~166 hours)
                  let value = e.target.value;
                  if (value.length > 4) {
                    value = value.slice(0, 4);
                  }
                  
                  const duration = value;
                  const calculatedPrice = onCalculatePrice(duration);
                  
                  onFormChange({
                    ...formData,
                    duration: duration,
                    price: calculatedPrice
                  });
                }}
                onKeyDown={(e) => {
                  // Allow only numbers and control keys
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="60"
                min={MINIMUM_DURATION}
                max={MAXIMUM_DURATION}
                maxLength={4}
                className="h-9 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.duration ? `${(parseInt(formData.duration) / 60).toFixed(1)}h` : "—"}
              </p>
            </div>
            <div>
              <Label htmlFor="price" className="text-sm">Total *</Label>
              <div className="h-9 bg-gray-100 rounded border flex items-center px-3 font-semibold text-sm">
                ₱{formData.price || "0"}
              </div>
              <p className="text-xs text-gray-500 mt-1">₱{tutor.hourlyRate}/h</p>
            </div>
          </div>

          {getDurationError() && (
            <p className="text-xs text-red-600 font-medium">
              {getDurationError()}
            </p>
          )}

          {/* Comments */}
          <div>
            <Label htmlFor="comment" className="text-sm">Comments</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => onFormChange({...formData, comment: e.target.value})}
              placeholder="Any topics or preferences..."
              rows={2}
              className="text-sm"
            />
          </div>

          <DialogFooter className="flex gap-2 justify-between text-xs">
            <div className="text-gray-600">
              • {MIN_HOURS}h min • {MAX_HOURS}h max
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-sm">
                Cancel
              </Button>
              <Button 
                onClick={onSubmit} 
                disabled={loading || !isFormValid()}
                className="h-8 text-sm"
              >
                {loading ? "Sending..." : "Book Session"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};