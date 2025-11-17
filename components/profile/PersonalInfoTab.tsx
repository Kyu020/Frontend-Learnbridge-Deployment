"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/interfaces/profile.interfaces"
import { Edit, Save, X, ChevronDown } from "lucide-react"

interface PersonalInfoTabProps {
  profile: UserProfile
  isEditing: boolean
  editedProfile: Partial<UserProfile>
  availableInterests: string[]
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
  onInputChange: (field: keyof UserProfile, value: any) => void
  onSave: () => void
  onCancel: () => void
  onEditToggle: () => void
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profile,
  isEditing,
  editedProfile,
  availableInterests,
  isDropdownOpen,
  setIsDropdownOpen,
  onInputChange,
  onSave,
  onCancel,
  onEditToggle
}) => {
  const displayProfile = isEditing ? { ...profile, ...editedProfile } : profile
  const currentInterests = displayProfile.learningInterests || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.interests-dropdown')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLearningInterestToggle = (interest: string) => {
    const currentInterests = editedProfile.learningInterests || []
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    
    onInputChange('learningInterests', newInterests)
  }

  const handleRemoveInterest = (interest: string) => {
    const currentInterests = editedProfile.learningInterests || []
    const newInterests = currentInterests.filter(i => i !== interest)
    onInputChange('learningInterests', newInterests)
  }

  const handleAvailabilityChange = (index: number, value: string) => {
    const newAvailability = [...(editedProfile.availability || [])]
    newAvailability[index] = value
    onInputChange('availability', newAvailability)
  }

  const addAvailabilitySlot = () => {
    const newAvailability = [...(editedProfile.availability || []), ""]
    onInputChange('availability', newAvailability)
  }

  const removeAvailabilitySlot = (index: number) => {
    const newAvailability = editedProfile.availability?.filter((_, i) => i !== index) || []
    onInputChange('availability', newAvailability)
  }
  
  const handleEditClick = () => {
    // Initialize editedProfile with current profile data when starting to edit
    if (!isEditing) {
      const editableFields: Partial<UserProfile> = {
        username: profile.username,
        learningLevel: profile.learningLevel,
        preferredMode: profile.preferredMode,
        learningInterests: [...profile.learningInterests],
        availability: [...profile.availability],
      }
      
      // Set each field individually to ensure they're properly initialized
      Object.entries(editableFields).forEach(([key, value]) => {
        onInputChange(key as keyof UserProfile, value)
      })
    }
    
    // Toggle edit mode
    onEditToggle()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={displayProfile.username}
              onChange={(e) => onInputChange('username', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={displayProfile.studentId}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={displayProfile.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="program">Program</Label>
            <Input
              id="program"
              value={displayProfile.program}
              onChange={(e) => onInputChange('program', e.target.value)}
              disabled
            />
          </div>
        </div>

        {/* Learning Level and Preferred Mode */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="learningLevel">Learning Level</Label>
            <select
              id="learningLevel"
              value={displayProfile.learningLevel}
              onChange={(e) => onInputChange('learningLevel', e.target.value)}
              disabled={!isEditing}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <Label htmlFor="preferredMode">Preferred Mode</Label>
            <select
              id="preferredMode"
              value={displayProfile.preferredMode}
              onChange={(e) => onInputChange('preferredMode', e.target.value)}
              disabled={!isEditing}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="online">Online</option>
              <option value="in-person">In Person</option>
              <option value="either">Either</option>
            </select>
          </div>
        </div>
        
        {/* Learning Interests - Dropdown Multiple Choice */}
        <div className="interests-dropdown">
          <Label htmlFor="learningInterests">Learning Interests</Label>
          {!isEditing ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {displayProfile.learningInterests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {/* Selected Interests */}
              <div className="flex flex-wrap gap-2">
                {currentInterests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Select learning interests...</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    {availableInterests.map((interest) => (
                      <div
                        key={interest}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        onClick={() => handleLearningInterestToggle(interest)}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentInterests.includes(interest)}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>{interest}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Select multiple interests relevant to your {displayProfile.program} program
              </p>
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <Label htmlFor="availability">Availability</Label>
          {!isEditing ? (
            <div className="mt-2 space-y-2">
              {displayProfile.availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">
                    {slot}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {editedProfile.availability?.map((slot, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={slot}
                    onChange={(e) => handleAvailabilityChange(index, e.target.value)}
                    placeholder="e.g., Monday 2:00 PM - 4:00 PM"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAvailabilitySlot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addAvailabilitySlot}
              >
                + Add Time Slot
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}