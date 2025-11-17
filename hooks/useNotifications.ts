// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { NotificationActivity } from '@/interfaces/progress.interfaces';
import { ProgressService } from '@/services/progress.service';
import { useAuth } from '@/contexts/authContext';

export interface FormattedNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  course: string;
  date: string;
  involvedUser?:string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<FormattedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const formatActivityAsNotification = useCallback((activity: NotificationActivity, index: number): FormattedNotification => {
    const getNotificationTitle = (activity: NotificationActivity): string => {
      switch (activity.type) {
        case 'resource':
          return `Resource ${activity.action}`;
        case 'session':
          return `Session ${activity.status}`;
        case 'progress':
          return 'Progress Update';
        default:
          return 'New Activity';
      }
    };

    const getNotificationMessage = (activity: NotificationActivity): string => {
      switch (activity.type) {
        case 'resource':
          return `${activity.course} - ${activity.title} resource was ${activity.action}`;
        case 'session':
          return `${activity.course} session is ${activity.status}`;
        default:
          return `Activity in ${activity.course}`;
      }
    };

    const formatTime = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} min ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
      } else {
        return date.toLocaleDateString();
      }
    };

    const uniqueId = activity.resourceId 
    ? `${activity.resourceId}-${activity.date}-${index}`
    : activity._id 
      ? `${activity._id}-${index}`
      : `${activity.date}-${index}`;

    return {
      id: uniqueId,
      title: getNotificationTitle(activity),
      message: getNotificationMessage(activity),
      time: formatTime(activity.date),
      read: false,
      type: activity.type,
      course: activity.course,
      date: activity.date
    };
  }, []);

  const sortActivitiesByDate = useCallback((activities: NotificationActivity[]): NotificationActivity[] => {
    return [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      const progressData = await ProgressService.getProgressData();
      const sortedActivities = sortActivitiesByDate(progressData.recentActivities);
      
      const formattedNotifications = sortedActivities.map((activity, index) => 
        formatActivityAsNotification(activity, index)
      );
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.length); // All are unread by default
      
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      setNotifications([]); // Set empty array on error
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [formatActivityAsNotification, sortActivitiesByDate]);

  // ADD THIS: Automatically fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      // If no user, clear notifications
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
    }
  }, [user, fetchNotifications]);

  // Mark a single notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Mark multiple notifications as read
  const markMultipleAsRead = useCallback((notificationIds: string[]) => {
    setNotifications(prev => 
      prev.map(notification => 
        notificationIds.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
  }, []);

  // Get only unread notifications
  const unreadNotifications = notifications.filter(notification => !notification.read);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    // State
    notifications,
    unreadNotifications,
    unreadCount,
    isLoading,
    error,
    
    // Actions
    markAsRead,
    markAllAsRead,
    markMultipleAsRead,
    refreshNotifications,
    getNotificationsByType,
    
    // Data helpers
    hasNotifications: notifications.length > 0,
  };
}