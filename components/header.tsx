// components/header.tsx
"use client"

import { Bell, LogOut, User, Settings, Menu, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/authContext"
import { useNotifications } from "@/hooks/useNotifications"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications()

  const handleLogout = async () => {
    try {
      logout()
      window.dispatchEvent(new Event('authChange'))
      router.push("/login")
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      })
    } catch (err) {
      console.error("Logout failed:", err)
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    await refreshNotifications()
    toast({
      title: "Notifications refreshed",
      description: "Your notifications have been updated.",
    })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      {/* Left side - Menu toggle only */}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right side - Notifications and User menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-w-md">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {error ? (
              <DropdownMenuItem className="justify-center p-4">
                <div className="text-sm text-destructive">{error}</div>
              </DropdownMenuItem>
            ) : isLoading ? (
              <DropdownMenuItem className="justify-center p-4">
                <div className="text-sm text-muted-foreground">Loading notifications...</div>
              </DropdownMenuItem>
            ) : notifications.length === 0 ? (
              <DropdownMenuItem className="justify-center p-4">
                <div className="text-sm text-muted-foreground">No notifications</div>
              </DropdownMenuItem>
            ) : (
              <>
                {notifications.slice(0, 4).map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-blue-50"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex w-full items-start justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <Link href="/notifications">
                  <DropdownMenuItem className="justify-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer hover:bg-blue-50">
                    View all notifications ({notifications.length})
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu remains the same */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {user?.profilePicture?.url ? (
                <img 
                  src={user.profilePicture.url} 
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.username || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}