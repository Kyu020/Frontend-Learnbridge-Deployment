import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ProfileService } from '@/services/profile.service'
import { UserProfile } from '@/interfaces/profile.interfaces'
import { useLearningInterests } from './useLearningInterest'

export const useProfile = () => {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
  
  const { availableInterests, isDropdownOpen, setIsDropdownOpen } = useLearningInterests(editedProfile.program || '')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await ProfileService.getProfile()
        setProfile(userProfile)
        setEditedProfile(userProfile)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  const handleSave = async () => {
    if (!profile) return

    try {
      const updatedProfile = await ProfileService.updateProfile(editedProfile)
      setProfile(updatedProfile)
      setIsEditing(false)
      setIsDropdownOpen(false)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(profile || {})
    setIsDropdownOpen(false)
  }

  return {
    isEditing,
    setIsEditing,
    isLoading,
    profile,
    editedProfile,
    availableInterests,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSave,
    handleInputChange,
    cancelEdit,
  }
}