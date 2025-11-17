import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useResourceUpload } from '@/hooks/useResourceUpload';
import { useToast } from '@/hooks/use-toast';

interface UploadDialogProps {
  onResourceUploaded: (resource: any) => void;
  trigger?: React.ReactNode;
}

const COURSE_OPTIONS = {
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

export const UploadDialog = ({ onResourceUploaded, trigger }: UploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const { uploadResource, uploading } = useResourceUpload();
  const { toast } = useToast();

  const handleOpen = () => {
    toast({
      title: "Upload Resource",
      description: "Fill in the details to share your resource",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedProgram || !selectedCourse || !file) {
      toast({
        title: "Missing information",
        description: "Please complete all fields.",
        variant: "destructive"
      });
      return;
    }

    // Combine program and course for the upload
    const course = `${selectedProgram}: ${selectedCourse}`;
    const resource = await uploadResource({ title, course, file });
    
    if (resource) {
      onResourceUploaded(resource);
      setIsOpen(false);
      setTitle('');
      setSelectedProgram('');
      setSelectedCourse('');
      setFile(null);
    }
  };

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    setSelectedCourse(''); // Reset course when program changes
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 w-full sm:w-auto" onClick={handleOpen} size="sm">
            <Upload className="h-4 w-4" /> 
            <span className="hidden sm:inline">Upload Resource</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Upload a New Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
            <Input
              id="title"
              placeholder="Enter resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program" className="text-sm sm:text-base">Program</Label>
            <Select value={selectedProgram} onValueChange={handleProgramChange}>
              <SelectTrigger id="program" className="text-sm sm:text-base">
                <SelectValue placeholder="Select your program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BSIT">BSIT</SelectItem>
                <SelectItem value="BSCS">BSCS</SelectItem>
                <SelectItem value="BSEMC">BSEMC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm sm:text-base">Course</Label>
            <Select 
              value={selectedCourse} 
              onValueChange={setSelectedCourse}
              disabled={!selectedProgram}
            >
              <SelectTrigger id="course" className="text-sm sm:text-base">
                <SelectValue placeholder={selectedProgram ? "Select course" : "Select program first"} />
              </SelectTrigger>
              <SelectContent>
                {selectedProgram && COURSE_OPTIONS[selectedProgram as keyof typeof COURSE_OPTIONS]?.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm sm:text-base">Upload File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.ppt,.pptx,.jpeg,.jpg,.png,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, PPT, JPEG, PNG, DOC
            </p>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={uploading} className="w-full text-sm sm:text-base">
              {uploading ? "Uploading..." : "Upload Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};