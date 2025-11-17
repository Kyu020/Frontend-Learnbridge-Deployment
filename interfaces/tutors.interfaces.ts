// interfaces/tutor.interface.ts
export interface ProfilePicture {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export interface Tutor {
  _id: string;
  studentId: string;
  name: string;
  bio: string;
  course: string[];
  hourlyRate: number;
  availability: string[];
  credentials?: string;
  favoriteCount: number;
  createdAt?: string;
  updatedAt?: string;
  teachingLevel: "beginner" | "intermediate" | "advanced";
  teachingStyle: "structured" | "interactive" | "conversational" | "project-based" | "problem-solving";
  modeOfTeaching: "online" | "in-person" | "either";
  ratingAverage: number;
  ratingCount: number;
  
  // New fields from User model
  username?: string;
  email?: string;
  program?: string;
  profilePicture?: ProfilePicture;
  learningLevel?: "beginner" | "intermediate" | "advanced";
  preferredMode?: "online" | "in-person" | "either";
  userAvailability?: string[];
  isTutor?: boolean;
}

export interface CompleteTutorProfile extends Tutor {
  username: string;
  email: string;
  program: string;
  learningLevel: "beginner" | "intermediate" | "advanced";
  preferredMode: "online" | "in-person" | "either";
  userAvailability: string[];
  isTutor: boolean;
}

export interface TutorFormData {
  bio: string;
  course: string;
  hourlyRate: string;
  availability: string;
  credentials: string;
  teachingLevel: "beginner" | "intermediate" | "advanced";
  teachingStyle: "structured" | "interactive" | "conversational" | "project-based" | "problem-solving";
  modeOfTeaching: "online" | "in-person" | "either";
}

export interface ScheduleFormData {
  sessionDate: string;
  sessionTime: string;
  duration: string;
  price: string;
  course: string;
  comment: string;
  modality: "online" | "in-person";
}

export interface Review {
  _id: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
  studentName: string;
  createdAt: string;
  updatedAt: string;
  // Optional: Add student profile picture if needed
  studentProfilePicture?: ProfilePicture;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface TutorProfileData {
  tutor: CompleteTutorProfile | null;
  reviews: Review[];
  userReview: Review | null;
  favorites: Set<string>;
  averageRating: number;
  ratingCounts: Array<{ rating: number; count: number }>;
}

export interface UserTutorStatus {
  isTutor: boolean;
  hasTutorProfile: boolean;
  userTutorProfile: Tutor | null;
}

// For the tutors list page
export interface TutorCardData {
  _id: string;
  studentId: string;
  name: string;
  bio: string;
  course: string[];
  hourlyRate: number;
  availability: string[];
  teachingLevel: "beginner" | "intermediate" | "advanced";
  teachingStyle: "structured" | "interactive" | "conversational" | "project-based" | "problem-solving";
  modeOfTeaching: "online" | "in-person" | "either";
  ratingAverage: number;
  ratingCount: number;
  favoriteCount: number;
  
  // User data for display
  username: string;
  program: string;
  profilePicture?: ProfilePicture;
}

// For API responses
export interface TutorsResponse {
  message: string;
  tutors: TutorCardData[];
}

export interface TutorProfileResponse {
  message: string;
  data: CompleteTutorProfile;
}

export interface MyTutorProfileResponse {
  message: string;
  data: CompleteTutorProfile;
}