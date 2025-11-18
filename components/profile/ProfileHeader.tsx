  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Card, CardContent }  from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import { UserProfile } from "@/interfaces/profile.interfaces"
  import { Award, Mail, User, BookOpen, Calendar, Camera } from "lucide-react"
  import { useState, useRef } from "react"
  import { toast } from "@/components/ui/use-toast"

  interface ProfileHeaderProps {
    profile: UserProfile
    isEditing: boolean
    onEditToggle: () => void
    onSave: () => void
    onCancel: () => void
    onPhotoUpdate: (newPhotoUrl: string) => void
  }

  export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile,
    onPhotoUpdate,
  }) => {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatJoinDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      uploadPhoto(file)
    }

    const uploadPhoto = async (file: File) => {
      setIsUploading(true)
      
      try {
        const formData = new FormData()
        formData.append('profilePicture', file)

        const token = localStorage.getItem('token')
        const response = await fetch('https://backend-learnbridge.onrender.com/api/profile/updateprofile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload photo')
        }

        const result = await response.json()
        
        // Update the photo in the parent component
        if (result.user?.profilePhoto?.url) {
          onPhotoUpdate(result.user.profilePhoto.url)
          toast({
            title: "Photo updated successfully",
            description: "Your profile photo has been updated",
          })
        }

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

      } catch (error) {
        console.error('Error uploading photo:', error)
        toast({
          title: "Upload failed",
          description: "Failed to update profile photo. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }

    const handleButtonClick = () => {
      fileInputRef.current?.click()
    }

    const getAvatarContent = () => {
      if (profile.profilePicture?.url) {
        return (
          <>
            <AvatarImage 
              src={profile.profilePicture.url} 
              alt={profile.username}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl">
              {profile.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </>
        )
      }
      return (
        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
          {profile.username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      )
    }

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {getAvatarContent()}
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <h2 className="mt-4 text-2xl font-bold text-foreground">{profile.username}</h2>
            <p className="text-sm text-muted-foreground">{profile.program} Student</p>
            <Badge className="mt-2" variant="secondary">
              <Award className="mr-1 h-3 w-3" />
              {profile.learningLevel.charAt(0).toUpperCase() + profile.learningLevel.slice(1)} Learner
            </Badge>
            <div className="mt-4 flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleButtonClick}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{profile.studentId}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{profile.program}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Joined {formatJoinDate(profile.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }