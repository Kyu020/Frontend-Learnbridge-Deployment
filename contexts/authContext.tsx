// contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface EarnedBadge {
  _id: string
  badgeId: {
    _id: string
    name: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    criteria: {
      type: string
      threshold: number
      consecutive?: boolean
    }
    rewards: {
      points: number
      perks: string[]
    }
    role: 'student' | 'tutor' | 'both'
    createdAt: string
    updatedAt: string
    __v: number
  }
  earnedAt: string
}

interface UserProfile {
  _id: string
  username: string
  studentId: string
  email: string
  program: string
  specialization?: string
  isTutor: boolean
  learningInterests: string[]
  learningLevel: string
  preferredMode: string
  availability: string[]
  createdAt: string
  profilePicture?: {
    url: string
    publicId: string
  }
  earnedBadges?:EarnedBadge[]
  budgetRange?:{
    min:number
    max:number
  }
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (token: string, userData: UserProfile) => void
  refreshUser: () => Promise<UserProfile | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ADD THIS FUNCTION
  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem('token', token)
    setUser(userData) // Immediately set the user data
    setIsLoading(false)
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('authChange'))
  }

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return null
      }

      const response = await fetch("http://localhost:5000/api/profile/getprofile", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        const userData = data.user
        setUser(userData)
        return userData
      } else {
        localStorage.removeItem('token')
        setUser(null)
        return null
      }
    } catch (error) {
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async (): Promise<UserProfile | null> => {
    return await fetchUserProfile()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('authChange'))
  }

  // Listen for storage changes (when login/logout happens in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        fetchUserProfile()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleAuthChange = () => {
      fetchUserProfile()
    }

    window.addEventListener('authChange', handleAuthChange)
    return () => window.removeEventListener('authChange', handleAuthChange)
  }, [])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, // ADDED
      refreshUser, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}