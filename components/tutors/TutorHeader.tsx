// components/tutors/TutorHeader.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";
import { UserTutorStatus } from '@/interfaces/tutors.interfaces';

interface TutorHeaderProps {
  userTutorStatus: UserTutorStatus;
  onToggleTutorMode: (checked: boolean) => void;
  onEditProfile: () => void;
  onCreateProfile: () => void;
}

export const TutorHeader = ({
  userTutorStatus,
  onToggleTutorMode,
  onEditProfile,
  onCreateProfile
}: TutorHeaderProps) => {
  
  const handleToggle = (checked: boolean) => {
    console.log('Toggling tutor mode to:', checked);
    console.log('Current userTutorStatus:', userTutorStatus);
    onToggleTutorMode(checked);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Find a Tutor
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Connect with expert tutors for personalized learning
        </p>
      </div>

      <div className="flex items-center gap-4">
        {userTutorStatus.hasTutorProfile ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-foreground whitespace-nowrap">Available as Tutor</Label>
              <Switch 
                checked={userTutorStatus.isTutor} 
                onCheckedChange={handleToggle}
              />
            </div>
            <Button variant="outline" size="sm" onClick={onEditProfile} className="whitespace-nowrap">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        ) : (
          <Button 
            onClick={onCreateProfile}
            size="sm"
            className="whitespace-nowrap"
          >
            Create Tutor Profile
          </Button>
        )}
      </div>
    </div>
  );
};