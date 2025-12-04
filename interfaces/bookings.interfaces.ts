// interfaces/bookings.interfaces.ts
export interface ProfilePicture {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export interface StudentInfo {
  _id: string;
  username: string;
  email: string;
  program: string;
  specialization: string;
  profilePicture?: ProfilePicture;
}

export interface TutorInfo {
  _id: string;
  username: string;
  email: string;
  program: string;
  specialization: string;
  profilePicture?: ProfilePicture;
}

export interface BookingsData {
  sentBookings: Booking[];
  receivedBookings: Booking[];
  isTutor: boolean;
}

export interface Booking {
  _id: string;
  studentId: string;
  tutorId: string;
  course: string;
  sessionDate: string | Date;
  duration: number;
  price: number;
  comment: string;
  tutorComment?: string;
  status: "pending" | "accepted" | "rejected" | "scheduled" | "in-progress" | "pending-evaluation" | "completed" | "cancelled" | "no-show";
  modality: "online" | "in-person";
  
  // Meeting info
  meetingId?: string;
  roomId?: string;
  meetingUrl?: string;
  
  // Session info
  sessionId?: string;
  sessionStatus?: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
  
  // User info (populated)
  studentInfo?: StudentInfo;
  tutorInfo?: TutorInfo;
  
  // For UI
  studentSeen?: boolean;
  tutorSeen?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Session interface for detailed session info
export interface Session {
  _id: string;
  studentId: string;
  tutorId: string;
  course: string;
  sessionDate: Date;
  duration: number;
  status: string;
  modality: string;
  meetingUrl?: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
  rating?: number;
  review?: string;
}

// Extended booking for session features
export interface BookingWithSession extends Booking {
  session?: Session;
  sessionEndTime?: Date;
  isInProgress?: boolean;
  canStart?: boolean;
  timeUntil?: {
    hours: number;
    minutes: number;
    formatted: string;
  };
}