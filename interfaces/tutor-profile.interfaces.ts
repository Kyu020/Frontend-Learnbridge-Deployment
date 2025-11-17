export interface Tutor {
  _id: string;
  studentId: string;
  name: string;
  bio: string;
  course: string[];
  hourlyRate: number;
  availability: string[];
  credentials?: string;
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface ScheduleFormData {
  sessionDate: string;
  time: string;
  duration: string;
  price: string;
  course: string;
  comment: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface TutorProfileData {
  tutor: Tutor | null;
  reviews: Review[];
  userReview: Review | null;
  favorites: Set<string>;
  averageRating: number;
  ratingCounts: Array<{ rating: number; count: number }>;
}