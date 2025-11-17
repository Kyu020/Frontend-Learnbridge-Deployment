// Mock data for the LearnBridge platform

export interface Resource {
  id: string
  title: string
  category: string
  subject: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: "Video" | "Document" | "Interactive" | "Quiz"
  duration: string
  students: number
  rating: number
  thumbnail: string
  description: string
  isFavorite?: boolean
}

export interface Tutor {
  id: string
  name: string
  avatar: string
  specialty: string[]
  rating: number
  reviews: number
  hourlyRate: number
  experience: string
  availability: string
  bio: string
}

export interface Booking {
  id: string
  tutorId: string
  tutorName: string
  tutorAvatar: string
  subject: string
  date: string
  time: string
  duration: string
  status: "upcoming" | "completed" | "cancelled"
  type: "online" | "in-person"
}

export interface Notification {
  id: string
  type: "session" | "resource" | "achievement" | "reminder"
  title: string
  message: string
  time: string
  read: boolean
}

export interface Progress {
  id: string
  subject: string
  progress: number
  hoursSpent: number
  sessionsCompleted: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
  progress: number
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  avatar: string
  role: "student" | "tutor"
}

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    subject: "Programming",
    difficulty: "Intermediate",
    type: "Video",
    duration: "8h 30m",
    students: 1247,
    rating: 4.8,
    thumbnail: "/data-structures-algorithms.png",
    description: "Comprehensive guide to data structures and algorithms",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Linear Algebra Practice",
    category: "Mathematics",
    subject: "Algebra",
    difficulty: "Advanced",
    type: "Interactive",
    duration: "12h 15m",
    students: 892,
    rating: 4.9,
    thumbnail: "/linear-algebra-mathematics.jpg",
    description: "Master linear algebra with interactive exercises",
  },
  {
    id: "3",
    title: "Machine Learning Workshop",
    category: "Computer Science",
    subject: "AI/ML",
    difficulty: "Advanced",
    type: "Video",
    duration: "15h 45m",
    students: 2103,
    rating: 4.7,
    thumbnail: "/machine-learning-ai.jpg",
    description: "Hands-on machine learning workshop with real projects",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Quantum Physics Fundamentals",
    category: "Physics",
    subject: "Quantum Mechanics",
    difficulty: "Intermediate",
    type: "Document",
    duration: "6h 20m",
    students: 654,
    rating: 4.6,
    thumbnail: "/quantum-physics-abstract.png",
    description: "Introduction to quantum physics principles",
  },
  {
    id: "5",
    title: "Organic Chemistry Lab",
    category: "Chemistry",
    subject: "Organic Chemistry",
    difficulty: "Intermediate",
    type: "Interactive",
    duration: "10h 30m",
    students: 1089,
    rating: 4.5,
    thumbnail: "/organic-chemistry-lab.jpg",
    description: "Virtual lab experiments in organic chemistry",
  },
  {
    id: "6",
    title: "Web Development Bootcamp",
    category: "Computer Science",
    subject: "Web Development",
    difficulty: "Beginner",
    type: "Video",
    duration: "20h 00m",
    students: 3421,
    rating: 4.9,
    thumbnail: "/web-development-coding.png",
    description: "Complete web development course from scratch",
  },
  {
    id: "7",
    title: "Calculus Mastery",
    category: "Mathematics",
    subject: "Calculus",
    difficulty: "Intermediate",
    type: "Video",
    duration: "14h 15m",
    students: 1876,
    rating: 4.8,
    thumbnail: "/calculus-mathematics.png",
    description: "Master calculus concepts with step-by-step guidance",
  },
  {
    id: "8",
    title: "Python Programming Quiz",
    category: "Computer Science",
    subject: "Programming",
    difficulty: "Beginner",
    type: "Quiz",
    duration: "2h 00m",
    students: 2567,
    rating: 4.7,
    thumbnail: "/python-programming-concept.png",
    description: "Test your Python programming knowledge",
  },
]

export const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Michael Chen",
    avatar: "/professional-male-tutor.png",
    specialty: ["Mathematics", "Physics", "Engineering"],
    rating: 4.9,
    reviews: 127,
    hourlyRate: 45,
    experience: "8 years",
    availability: "Mon-Fri, 2pm-8pm",
    bio: "PhD in Applied Mathematics with extensive teaching experience",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "/professional-female-tutor.png",
    specialty: ["Computer Science", "Web Development", "Data Science"],
    rating: 5.0,
    reviews: 203,
    hourlyRate: 55,
    experience: "10 years",
    availability: "Tue-Sat, 10am-6pm",
    bio: "Senior Software Engineer and passionate educator",
  },
  {
    id: "3",
    name: "Prof. James Wilson",
    avatar: "/professor-male-teacher.jpg",
    specialty: ["Chemistry", "Biology", "Research Methods"],
    rating: 4.8,
    reviews: 89,
    hourlyRate: 60,
    experience: "15 years",
    availability: "Mon-Thu, 3pm-9pm",
    bio: "University Professor specializing in organic chemistry",
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    avatar: "/professional-female-teacher.png",
    specialty: ["Languages", "Literature", "Writing"],
    rating: 4.9,
    reviews: 156,
    hourlyRate: 40,
    experience: "6 years",
    availability: "Mon-Fri, 9am-5pm",
    bio: "Multilingual educator with a passion for languages",
  },
]

export const mockBookings: Booking[] = [
  {
    id: "1",
    tutorId: "1",
    tutorName: "Michael Chen",
    tutorAvatar: "/professional-male-tutor.png",
    subject: "Calculus II - Derivatives",
    date: "2025-04-12",
    time: "14:00",
    duration: "1 hour",
    status: "upcoming",
    type: "online",
  },
  {
    id: "2",
    tutorId: "2",
    tutorName: "Sarah Johnson",
    tutorAvatar: "/professional-female-tutor.png",
    subject: "React Advanced Patterns",
    date: "2025-04-15",
    time: "16:30",
    duration: "1.5 hours",
    status: "upcoming",
    type: "online",
  },
  {
    id: "3",
    tutorId: "3",
    tutorName: "Prof. James Wilson",
    tutorAvatar: "/professor-male-teacher.jpg",
    subject: "Organic Chemistry Lab Review",
    date: "2025-04-08",
    time: "15:00",
    duration: "2 hours",
    status: "completed",
    type: "in-person",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "session",
    title: "Upcoming Session",
    message: "Your session with Michael Chen starts in 2 hours",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "resource",
    title: "New Resource Available",
    message: "Machine Learning Workshop has been updated with new content",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "You completed 10 study sessions this month",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "reminder",
    title: "Study Reminder",
    message: "Don't forget to review your Linear Algebra notes",
    time: "2 days ago",
    read: true,
  },
]

export const mockProgress: Progress[] = [
  {
    id: "1",
    subject: "Advanced Calculus",
    progress: 75,
    hoursSpent: 12,
    sessionsCompleted: 8,
  },
  {
    id: "2",
    subject: "Quantum Physics",
    progress: 60,
    hoursSpent: 9,
    sessionsCompleted: 6,
  },
  {
    id: "3",
    subject: "Data Structures",
    progress: 85,
    hoursSpent: 15,
    sessionsCompleted: 10,
  },
  {
    id: "4",
    subject: "Organic Chemistry",
    progress: 45,
    hoursSpent: 6,
    sessionsCompleted: 4,
  },
]

export const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Session",
    description: "Complete your first tutoring session",
    icon: "trophy",
    unlocked: true,
    unlockedDate: "Feb 15, 2024",
    progress: 100,
  },
  {
    id: "2",
    title: "Quick Learner",
    description: "Complete 10 sessions in a month",
    icon: "zap",
    unlocked: true,
    unlockedDate: "Mar 1, 2024",
    progress: 100,
  },
  {
    id: "3",
    title: "Dedicated Student",
    description: "Maintain a 7-day learning streak",
    icon: "target",
    unlocked: true,
    unlockedDate: "Mar 10, 2024",
    progress: 100,
  },
  {
    id: "4",
    title: "Subject Master",
    description: "Reach 90% progress in any subject",
    icon: "award",
    unlocked: false,
    progress: 85,
  },
  {
    id: "5",
    title: "Marathon Learner",
    description: "Complete 50 total hours of learning",
    icon: "trophy",
    unlocked: false,
    progress: 60,
  },
  {
    id: "6",
    title: "Perfect Attendance",
    description: "Attend 20 sessions without cancellation",
    icon: "target",
    unlocked: false,
    progress: 40,
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Williams",
    avatar: "/student-avatar.jpg",
    role: "student",
  },
  {
    id: "2",
    email: "demo@learnbridge.com",
    password: "demo123",
    name: "Demo User",
    avatar: "/demo-avatar.jpg",
    role: "student",
  },
  {
    id: "3",
    email: "tutor@example.com",
    password: "tutor123",
    name: "Michael Chen",
    avatar: "/professional-male-tutor.png",
    role: "tutor",
  },
]
