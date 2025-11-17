"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, BookOpen, Award, Clock, Check, Trash2, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications, FormattedNotification } from "@/hooks/useNotifications"
import { toast } from "@/components/ui/use-toast"

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    hasNotifications
  } = useNotifications()

  const [localNotifications, setLocalNotifications] = useState<FormattedNotification[]>([])

  // Sync local state with hook state
  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const deleteNotification = (id: string) => {
    setLocalNotifications(prev => prev.filter((n) => n.id !== id))
    // If the notification was unread, we need to update the unread count
    const notification = notifications.find(n => n.id === id)
    if (notification && !notification.read) {
      markAsRead(id) // This will update the unread count in the hook
    }
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
    setLocalNotifications(prev => 
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
    setLocalNotifications(prev => 
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  const handleRefresh = async () => {
    await refreshNotifications()
    toast({
      title: "Notifications refreshed",
      description: "Your notifications have been updated.",
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "session":
        return <Calendar className="h-5 w-5 text-blue-600" />
      case "resource":
        return <BookOpen className="h-5 w-5 text-green-600" />
      case "progress":
        return <Award className="h-5 w-5 text-yellow-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationTitle = (notification: FormattedNotification) => {
    return notification.title
  }

  const getNotificationMessage = (notification: FormattedNotification) => {
    return notification.message
  }

  const NotificationCard = ({ notification }: { notification: FormattedNotification }) => (
    <Card className={`transition-all ${!notification.read ? "border-l-4 border-l-blue-600 bg-blue-50/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h4 className="font-semibold text-foreground">{getNotificationTitle(notification)}</h4>
              {!notification.read && <Badge variant="secondary">New</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{getNotificationMessage(notification)}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{notification.time}</p>
              <p className="text-xs text-muted-foreground">Course: {notification.course}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {!notification.read && (
              <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(notification.id)} title="Mark as read">
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNotification(notification.id)}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 pl-64">
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center py-12">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="mb-4 h-12 w-12 text-destructive" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Error loading notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button onClick={refreshNotifications}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">
                {isLoading 
                  ? "Loading notifications..." 
                  : unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" onClick={handleMarkAllAsRead} disabled={isLoading}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="mb-4 h-12 w-12 text-muted-foreground animate-spin" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Loading notifications</h3>
                <p className="text-sm text-muted-foreground">Please wait while we load your notifications...</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({localNotifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="resource">Resources</TabsTrigger>
                <TabsTrigger value="session">Sessions</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {hasNotifications ? (
                  localNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold text-foreground">No notifications</h3>
                      <p className="text-sm text-muted-foreground">You're all caught up!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-4">
                {unreadCount > 0 ? (
                  localNotifications
                    .filter((n) => !n.read)
                    .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Check className="mb-4 h-12 w-12 text-green-600" />
                      <h3 className="mb-2 text-lg font-semibold text-foreground">All caught up!</h3>
                      <p className="text-sm text-muted-foreground">No unread notifications</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="resource" className="space-y-4">
                {localNotifications.filter((n) => n.type === "resource").length > 0 ? (
                  localNotifications
                    .filter((n) => n.type === "resource")
                    .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold text-foreground">No resource notifications</h3>
                      <p className="text-sm text-muted-foreground">Resource updates will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="session" className="space-y-4">
                {localNotifications.filter((n) => n.type === "session").length > 0 ? (
                  localNotifications
                    .filter((n) => n.type === "session")
                    .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold text-foreground">No session notifications</h3>
                      <p className="text-sm text-muted-foreground">Session updates will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                {localNotifications.filter((n) => n.type === "progress").length > 0 ? (
                  localNotifications
                    .filter((n) => n.type === "progress")
                    .map((notification) => <NotificationCard key={notification.id} notification={notification} />)
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Award className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold text-foreground">No progress notifications</h3>
                      <p className="text-sm text-muted-foreground">Progress updates will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}