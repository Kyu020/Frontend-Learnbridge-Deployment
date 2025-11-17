export interface EarnedBadge {
  badgeId: {
    _id: string
    name: string
    description: string
    icon: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }
  earnedAt: string
}

export interface UserProfile {
  _id: string
  username: string
  studentId: string
  email: string
  program: string
  isTutor: boolean
  learningInterests: string[]
  learningLevel: "beginner" | "intermediate" | "advanced"
  preferredMode: "online" | "in-person" | "either"
  availability: string[]
  createdAt: string
  earnedBadges: EarnedBadge[]
  budgetRange?: {
    min: number
    max: number
  }
  phone?: string
  location?: string
  bio?: string
  profilePicture?: {
    url: string
    publicId: string
  }
}

export type LearningLevel = "beginner" | "intermediate" | "advanced"
export type PreferredMode = "online" | "in-person" | "either"