// components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Users, Calendar, TrendingUp, Settings, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Tutors", href: "/tutors", icon: Users },
  { name: "My Bookings", href: "/bookings", icon: Calendar },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Profile", href: "/profile", icon: Settings },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  const getUserDisplayInfo = () => {
    if (isLoading) {
      return { name: "Loading...", program: "Loading..." }
    }
    
    if (!user) {
      return { name: "Guest User", program: "Not enrolled" }
    }

    const name = user.username || "Unknown User"
    const program = user.program || "No program"

    return { name, program }
  }

  const { name, program } = getUserDisplayInfo()

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Image 
                  src="/logo.jpg" // Update this path to match your logo file
                  alt="LearnBridge Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-foreground">LearnBridge</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMobileClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              {user?.profilePicture?.url ? (
                <img 
                  src={user.profilePicture.url} 
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{program}</p>
                {user?.isTutor && (
                  <p className="text-xs text-blue-600 font-medium mt-1">Tutor</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}