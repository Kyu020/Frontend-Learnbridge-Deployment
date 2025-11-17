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
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => onFormChange({ ...formData, teachingLevel: e.target.value })}
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
              onChange={(e) => onFormChange({ ...formData, teachingStyle: e.target.value })}
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

          {/* Availability */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Availability (comma separated)</Label>
            <Input
              value={formData.availability}
              onChange={(e) => onFormChange({ ...formData, availability: e.target.value })}
              placeholder="Monday 10AM-12PM, Wednesday 1PM-4PM, Friday 9AM-11AM"
              className="text-sm sm:text-base"
            />
            <p className="text-xs text-muted-foreground">
              Specify your available time slots separated by commas
            </p>
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
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="text-sm sm:text-base"
            >
              {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Profile" : "Create Profile")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};