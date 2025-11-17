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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Don't render if tutor is null
  if (!tutor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Session with {tutor.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Modality Selection */}
          <div>
            <Label className="text-sm font-medium">Session Type *</Label>
            <RadioGroup 
              value={formData.modality} 
              onValueChange={(value: 'online' | 'in-person') => 
                onFormChange({...formData, modality: value})
              }
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="cursor-pointer flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span>🎥</span>
                    <span className="font-medium">Online Meeting</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Virtual session via video call
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="cursor-pointer flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span className="font-medium">In-Person</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Face-to-face session
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="course">Subject *</Label>
            <Select 
              value={formData.course} 
              onValueChange={(value) => onFormChange({...formData, course: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {tutor.course.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionDate">Date *</Label>
              <Input
                id="sessionDate"
                type="date"
                value={formData.sessionDate}
                onChange={(e) => onFormChange({...formData, sessionDate: e.target.value})}
                min={getMinDate()}
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.sessionTime}
                onChange={(e) => onFormChange({...formData, sessionTime: e.target.value})}
                min={getMinTime()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => {
                  const duration = e.target.value;
                  const calculatedPrice = onCalculatePrice(duration);
                  
                  onFormChange({
                    ...formData,
                    duration: duration,
                    price: calculatedPrice
                  });
                }}
                placeholder="60"
                min="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(parseInt(formData.duration) / 60).toFixed(1)} hours
              </p>
            </div>
            <div>
              <Label htmlFor="price">Total Price (₱) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                readOnly
                className="bg-muted cursor-not-allowed"
                placeholder="Auto-calculated"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ₱{tutor.hourlyRate}/hour × {(parseInt(formData.duration) / 60).toFixed(1)} hours
              </p>
            </div>
          </div>

          {/* Modality-specific information */}
          {formData.modality === 'online' && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🎥</span>
                <span className="text-sm font-medium text-blue-900">Online Session</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                A virtual meeting room will be automatically created when your booking is confirmed. 
                You'll receive a link to join the video call.
              </p>
            </div>
          )}

          {formData.modality === 'in-person' && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">📍</span>
                <span className="text-sm font-medium text-green-900">In-Person Session</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Please coordinate with the tutor about the specific meeting location.
              </p>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900">Cost Breakdown:</span>
            </div>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span>₱{tutor.hourlyRate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formData.duration} minutes ({(parseInt(formData.duration) / 60).toFixed(1)} hours)</span>
              </div>
              <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                <span>Total Cost:</span>
                <span className="text-lg">₱{formData.price}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Additional Comments</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => onFormChange({...formData, comment: e.target.value})}
              placeholder={
                formData.modality === 'online' 
                  ? "Any specific topics you want to cover or technical requirements..."
                  : "Any specific topics you want to cover or location preferences..."
              }
              rows={3}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Sending Request..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};