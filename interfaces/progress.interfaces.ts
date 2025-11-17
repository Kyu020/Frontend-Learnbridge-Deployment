export interface SessionHistory {
  _id: string;
  studentId: string;
  tutorId: string;
  course: string;
  sessionDate: string;
  duration: number;
  price: number;
  status: string;
  studentSeen: boolean;
  tutorSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecentActivity {
  type: string;
  title: string;
  course: string;
  date: string;
  duration?: number;
  status?: string;
  resourceId?: string;
  action?: string;
}

export interface NotificationActivity{
  _id?: string;
  type: string;
  title?: string;
  course: string;
  date: string;
  duration?: number;
  status?: string;
  resourceId?: string;
  action?: string;
  read?: boolean;
}

export interface ProgressData {
  sessionsByCourse: Record<string, number>;
  studentDurationByCourse: Record<string, number>;
  tutorDurationByCourse: Record<string, number>;
  resourcesViewedByCourse: Record<string, number>;
  sessionHistory: SessionHistory[];
  recentActivities: RecentActivity[];
  notificationActivities: NotificationActivity[];
  totalTutoredSessions: number;
  totalTutoredDuration: number;
}

export interface WeeklyStat {
  day: string;
  hours: number;
}

export interface FormattedActivity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  date: string;
  icon: any;
  color: string;
}