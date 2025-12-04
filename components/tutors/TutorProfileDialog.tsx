// components/tutors/TutorProfileDialog.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TutorFormData } from '@/interfaces/tutors.interfaces';
import { useAuth } from "@/contexts/authContext";

interface TutorProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: TutorFormData;
  onFormChange: (data: TutorFormData) => void;
  onSubmit: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const PROGRAM_SUBJECTS = {
  BSIT: [
    "Web Development",
    "Networking",
    "Database Systems",
    "Information Security",
    "IT Infrastructure",
    "Cloud Computing",
    "Systems Administration",
    "Business Analytics",
    "Mobile App Development",
    "IT Project Management",
    "E-Commerce Technologies",
    "DevOps Fundamentals",
    "Research & Emerging Technologies",
    "GEC Courses",
    "Others"
  ],
  BSCS: [
    "Artificial Intelligence",
    "Software Engineering",
    "Data Science",
    "Cybersecurity",
    "Machine Learning",
    "Human-Computer Interaction",
    "Distributed Systems",
    "Computer Graphics",
    "Algorithms & Computation",
    "Systems Programming",
    "Robotics",
    "Computational Biology",
    "GEC Courses",
    "Others"
  ],
  BSEMC: [
    "Game Development",
    "Animation",
    "Multimedia Arts",
    "3D Modeling",
    "Digital Film Production",
    "Visual Effects (VFX)",
    "Graphic Design",
    "Audio & Sound Design",
    "UI/UX for Games",
    "Motion Graphics",
    "Interactive Media",
    "GEC Courses",
    "Others"
  ]
};

// More robust program detection
const getProgramSubjects = (program: string): string[] => {
  if (!program) {
    console.warn('No program provided, defaulting to BSIT');
    return PROGRAM_SUBJECTS.BSIT;
  }
  
  const normalizedProgram = program.toUpperCase().trim();
  console.log('Normalized program:', normalizedProgram);
  
  // Check for exact matches first
  if (PROGRAM_SUBJECTS.hasOwnProperty(normalizedProgram)) {
    return PROGRAM_SUBJECTS[normalizedProgram as keyof typeof PROGRAM_SUBJECTS];
  }
  
  // Check for partial matches
  if (normalizedProgram.includes('EMC') || normalizedProgram.includes('ENTERTAINMENT') || normalizedProgram.includes('MULTIMEDIA')) {
    return PROGRAM_SUBJECTS.BSEMC;
  }
  if (normalizedProgram.includes('CS') || normalizedProgram.includes('COMPUTER SCIENCE')) {
    return PROGRAM_SUBJECTS.BSCS;
  }
  if (normalizedProgram.includes('IT') || normalizedProgram.includes('INFORMATION TECHNOLOGY')) {
    return PROGRAM_SUBJECTS.BSIT;
  }
  
  console.warn(`Program "${program}" not recognized, defaulting to BSIT`);
  return PROGRAM_SUBJECTS.BSIT;
};

// Helper to get program display name
const getProgramDisplayName = (program: string): string => {
  const programMap: { [key: string]: string } = {
    'BSIT': 'BS in Information Technology',
    'BSCS': 'BS in Computer Science', 
    'BSEMC': 'BS in Entertainment and Multimedia Computing',
    'EMC': 'BS in Entertainment and Multimedia Computing',
    'ENTERTAINMENT AND MULTIMEDIA COMPUTING': 'BS in Entertainment and Multimedia Computing'
  };
  
  const normalizedProgram = program.toUpperCase().trim();
  return programMap[normalizedProgram] || program;
};

export const TutorProfileDialog = ({
  open,
  onOpenChange,
  title,
  formData,
  onFormChange,
  onSubmit,
  loading,
  isEdit = false,
  // Remove userProgram from props
}: TutorProfileDialogProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get user data from AuthContext
  const { user } = useAuth();
  
  // Get subjects for the user's specific program from context
  const userProgram = user?.program || '';
  const programSubjects = getProgramSubjects(userProgram);
  const programDisplayName = getProgramDisplayName(userProgram);

  // Debug: Log the program info
  useEffect(() => {
    console.log('User from AuthContext:', user);
    console.log('User Program:', userProgram);
    console.log('Program Display Name:', programDisplayName);
    console.log('Program Subjects:', programSubjects);
  }, [user, userProgram, programDisplayName, programSubjects]);

  // Rest of the component remains the same...
  const handleSubjectChange = (subject: string, checked: boolean) => {
    const currentCourses = formData.course.split(',').map(s => s.trim()).filter(s => s);
    let newSubjects: string[];
    
    if (checked) {
      newSubjects = [...currentCourses, subject];
    } else {
      newSubjects = currentCourses.filter(s => s !== subject);
    }
    
    onFormChange({ ...formData, course: newSubjects.join(', ') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const selectedSubjects = formData.course.split(',').map(s => s.trim()).filter(s => s);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-4xl h-[90vh] max-h-[90vh] p-6 gap-4">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1">
          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Bio *</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => onFormChange({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself, your teaching experience, and why you'd make a great tutor..."
              required
              className="text-sm sm:text-base min-h-[80px]"
            />
          </div>

          {/* Subjects Dropdown - Program Specific */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Subjects *</Label>
            
            <div className="relative" ref={dropdownRef}>
              {/* Dropdown trigger */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-left"
              >
                <span className={selectedSubjects.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                  {selectedSubjects.length > 0 
                    ? `${selectedSubjects.length} subject(s) selected`
                    : `Select ${programDisplayName} subjects...`
                  }
                </span>
                <svg
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Selected chips */}
              {selectedSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSubjects.map((subject) => (
                    <div
                      key={subject}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleSubjectChange(subject, false)}
                        className="hover:bg-primary/20 rounded-sm w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Dropdown content - Shows only program-specific subjects */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-input bg-background rounded-md shadow-lg z-10">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                    {programDisplayName} Subjects
                  </div>
                  {programSubjects.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject);
                    return (
                      <label
                        key={subject}
                        className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-accent ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm flex-1">{subject}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Select subjects you can tutor from your {programDisplayName} program
            </p>
          </div>

          {/* Hourly Rate */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Hourly Rate (₱) *</Label>
            <Input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => onFormChange({ ...formData, hourlyRate: e.target.value })}
              placeholder="150"
              min="0"
              required
              className="text-sm sm:text-base"
            />
          </div>

          {/* Teaching Level */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Teaching Level *</Label>
            <select
              value={formData.teachingLevel}
              onChange={(e) => onFormChange({ 
                ...formData, 
                teachingLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' 
              })}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select teaching level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Teaching Style */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Teaching Style *</Label>
            <select
              value={formData.teachingStyle}
              onChange={(e) => onFormChange({ 
                ...formData, 
                teachingStyle: e.target.value as 'structured' | 'interactive' | 'conversational' | 'project-based' | 'problem-solving'
              })}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select teaching style</option>
              <option value="structured">Structured & Formal</option>
              <option value="interactive">Interactive & Hands-on</option>
              <option value="conversational">Conversational & Relaxed</option>
              <option value="project-based">Project-based</option>
              <option value="problem-solving">Problem-solving Focused</option>
            </select>
          </div>

          {/* Mode of Teaching */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Mode of Teaching *</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="modeOfTeaching"
                  value="online"
                  checked={formData.modeOfTeaching === "online"}
                  onChange={(e) => onFormChange({ ...formData, modeOfTeaching: e.target.value as "online" | "in-person" | "either" })}
                  className="h-4 w-4"
                />
                <span className="text-sm">Online</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="modeOfTeaching"
                  value="in-person"
                  checked={formData.modeOfTeaching === "in-person"}
                  onChange={(e) => onFormChange({ ...formData, modeOfTeaching: e.target.value as "online" | "in-person" | "either" })}
                  className="h-4 w-4"
                />
                <span className="text-sm">In-Person</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="modeOfTeaching"
                  value="either"
                  checked={formData.modeOfTeaching === "either"}
                  onChange={(e) => onFormChange({ ...formData, modeOfTeaching: e.target.value as "online" | "in-person" | "either" })}
                  className="h-4 w-4"
                />
                <span className="text-sm">Either</span>
              </label>
            </div>
          </div>

          {/* Availability Slots - New Structured Format */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex-1 min-w-0">
                <Label className="text-sm sm:text-base font-semibold">Availability Schedule *</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Set your teaching hours for each day (students can only book within these times)
                </p>
              </div>
              <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">
                {formData.availabilitySlots?.length || 0} slot{formData.availabilitySlots?.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                const daySlots = (formData.availabilitySlots || []).filter(slot => slot.dayOfWeek === day);
                const hasSlots = daySlots.length > 0;

                return (
                  <div key={day} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm capitalize text-slate-700 w-20">{day}</span>
                      
                      {daySlots.length === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSlot = {
                              dayOfWeek: day as any,
                              startTime: "09:00",
                              endTime: "17:00",
                              isActive: true
                            };
                            const updated = [...(formData.availabilitySlots || []), newSlot];
                            onFormChange({ ...formData, availabilitySlots: updated });
                          }}
                          className="text-xs h-8"
                        >
                          + Add time
                        </Button>
                      ) : (
                        <div className="text-xs text-green-600 font-medium">✓ Available</div>
                      )}
                    </div>

                    {daySlots.map((slot, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:ml-20 p-2 bg-slate-50 rounded overflow-x-hidden">
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => {
                            const updated = formData.availabilitySlots?.map(s =>
                              s.dayOfWeek === day && s === slot
                                ? { ...s, startTime: e.target.value }
                                : s
                            ) || [];
                            onFormChange({ ...formData, availabilitySlots: updated });
                          }}
                          className="h-10 text-base font-semibold flex-1 min-w-0"
                        />
                        <span className="text-sm text-slate-500 hidden sm:inline">to</span>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => {
                            const updated = formData.availabilitySlots?.map(s =>
                              s.dayOfWeek === day && s === slot
                                ? { ...s, endTime: e.target.value }
                                : s
                            ) || [];
                            onFormChange({ ...formData, availabilitySlots: updated });
                          }}
                          className="h-10 text-base font-semibold flex-1 min-w-0"
                        />
                        <label className="flex items-center gap-1 text-sm cursor-pointer whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={slot.isActive}
                            onChange={(e) => {
                              const updated = formData.availabilitySlots?.map(s =>
                                s.dayOfWeek === day && s === slot
                                  ? { ...s, isActive: e.target.checked }
                                  : s
                              ) || [];
                              onFormChange({ ...formData, availabilitySlots: updated });
                            }}
                            className="h-2 w-2"
                          />
                          <span>Active</span>
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = formData.availabilitySlots?.filter(s => !(s.dayOfWeek === day && s === slot)) || [];
                            onFormChange({ ...formData, availabilitySlots: updated });
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 flex-shrink-0"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}

                    {daySlots.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSlot = {
                            dayOfWeek: day as any,
                            startTime: "09:00",
                            endTime: "17:00",
                            isActive: true
                          };
                          const updated = [...(formData.availabilitySlots || []), newSlot];
                          onFormChange({ ...formData, availabilitySlots: updated });
                        }}
                        className="text-xs h-7 ml-20 text-blue-600 hover:bg-blue-50"
                      >
                        + Add another time
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {!formData.availabilitySlots || formData.availabilitySlots.length === 0 ? (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
                ⚠️ You must add at least one available time slot
              </div>
            ) : (
              <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                ✓ Your availability is set. Students can only book during these times.
              </div>
            )}
          </div>

          {/* Credentials */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Credentials</Label>
            <Textarea
              value={formData.credentials}
              onChange={(e) => onFormChange({ ...formData, credentials: e.target.value })}
              placeholder="List your qualifications, achievements, certifications, portfolio links, or relevant experience..."
              className="text-sm sm:text-base min-h-[60px]"
            />
            <p className="text-xs text-muted-foreground">
              Include any relevant qualifications, achievements, or portfolio links
            </p>
          </div>
          
          <DialogFooter className="pt-3 border-t flex-shrink-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="text-sm"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="text-sm"
            >
              {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Profile" : "Create Profile")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};