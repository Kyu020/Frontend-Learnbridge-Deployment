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

export interface Booking {
  _id: string;
  studentId: string;
  tutorId: string;
  sessionDate: string;
  duration: number;
  price: number;
  course: string;
  comment: string;
  tutorComment?: string;
  status: "pending" | "accepted" | "completed" | "rejected" | "cancelled";
  modality: "online" | "in-person";

  meetingId?: string;
  roomId?: string;
  meetingUrl?: string;

  createdAt: string;
  updatedAt: string;
  studentInfo?: StudentInfo;
  tutorInfo?: TutorInfo;
}

export interface BookingsData {
  sentBookings: Booking[];
  receivedBookings: Booking[];
  isTutor: boolean;
}