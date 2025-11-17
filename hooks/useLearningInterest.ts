import { useState, useEffect } from "react"
import { LEARNING_INTERESTS_BY_PROGRAM } from "@/constants/learning-interests"

export const useLearningInterests = (program: string) => {
  const [availableInterests, setAvailableInterests] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (program in LEARNING_INTERESTS_BY_PROGRAM) {
      setAvailableInterests(LEARNING_INTERESTS_BY_PROGRAM[program] || [])
    }
  }, [program])

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

  return {
    availableInterests,
    isDropdownOpen,
    setIsDropdownOpen
  }
}