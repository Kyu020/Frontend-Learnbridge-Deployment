import { useState, useEffect } from 'react';
import { ProgressData, WeeklyStat, FormattedActivity } from '@/interfaces/progress.interfaces';
import { ProgressService } from '@/services/progress.service';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/authContext';

export const useProgress = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ProgressService.getProgressData();
      setProgressData(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    if (!progressData) return null;

    const sessionsByCourse = progressData.sessionsByCourse || {};
    const studentDurationByCourse = progressData.studentDurationByCourse || {};
    const tutorDurationByCourse = progressData.tutorDurationByCourse || {};
    const resourcesViewedByCourse = progressData.resourcesViewedByCourse || {};

    const totalSessions = Object.values(sessionsByCourse).reduce((sum, count) => sum + count, 0);
    const totalStudyMinutes = Object.values(studentDurationByCourse).reduce((sum, minutes) => sum + minutes, 0);
    const totalStudyHours = Math.round(totalStudyMinutes / 60);
    const totalResources = Object.values(resourcesViewedByCourse).reduce((sum, count) => sum + count, 0);
    
    const totalTutoredSessions = progressData.totalTutoredSessions || 0;
    const totalTutoredMinutes = progressData.totalTutoredDuration || 0;
    const totalTutoredHours = Math.round(totalTutoredMinutes / 60);
    const tutoringCourses = Object.keys(tutorDurationByCourse).length;
    
    // FIXED: Use actual badge count from user profile instead of hardcoded calculation
    const achievements = user?.earnedBadges?.length || 0;

    return {
      totalSessions,
      totalStudyMinutes,
      totalStudyHours,
      totalResources,
      totalTutoredSessions,
      totalTutoredMinutes,
      totalTutoredHours,
      tutoringCourses,
      achievements,
    };
  };

  // Generate weekly stats
  const getWeeklyStats = (): WeeklyStat[] => {
    if (!progressData?.sessionHistory) return [];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return last7Days.map((date, index) => {
      const dayDate = new Date(date);
      const dayName = dayNames[dayDate.getDay()];
      
      const dayHours = (progressData.sessionHistory || [])
        .filter(session => session.sessionDate.startsWith(date))
        .reduce((total, session) => total + (session.duration / 60), 0);

      return {
        day: dayName,
        hours: Math.round(dayHours * 10) / 10,
      };
    });
  };

  // Format recent activities
  const getFormattedActivities = (): FormattedActivity[] => {
    if (!progressData?.recentActivities) return [];

    const formatStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'completed': 'Completed',
        'rejected': 'Rejected',
        'cancelled': 'Cancelled'
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    };

    return progressData.recentActivities.map((activity, index) => {
      const getActivityDetails = () => {
        switch (activity.type) {
          case "session":
            return {
              title: `${formatStatus(activity.status ?? "unknown")} ${activity.course} session`,
              subtitle: `${activity.duration || 0} minutes`,
              icon: CheckCircle2,
              color: "text-green-600"
            };
          case "resource":
            return {
              title: `Viewed ${activity.course} - ${activity.title}`,
              subtitle: activity.action === "viewed" ? "Resource viewed" : "Resource activity",
              icon: BookOpen,
              color: "text-blue-600"
            };
          default:
            return {
              title: `Activity in ${activity.course}`,
              subtitle: "Learning activity",
              icon: CheckCircle2,
              color: "text-gray-600"
            };
        }
      };

      const details = getActivityDetails();
      const activityDate = new Date(activity.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - activityDate.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateText = "";
      if (diffHours < 24) dateText = `${diffHours} hours ago`;
      else if (diffDays === 1) dateText = "1 day ago";
      else dateText = `${diffDays} days ago`;

      return {
        id: `activity-${index}`,
        type: activity.type,
        title: details.title,
        subtitle: details.subtitle,
        date: dateText,
        icon: details.icon,
        color: details.color,
      };
    });
  };

  const stats = calculateStats();
  const weeklyStats = getWeeklyStats();
  const formattedActivities = getFormattedActivities();
  const maxHours = Math.max(...weeklyStats.map((s) => s.hours), 1);

  return {
    progressData,
    loading,
    error,
    stats,
    weeklyStats,
    formattedActivities,
    maxHours,
    refetch: fetchProgressData,
  };
};