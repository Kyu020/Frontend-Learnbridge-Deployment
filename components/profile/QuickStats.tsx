import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile } from "@/interfaces/profile.interfaces"
import { BookOpen, Bookmark, ZapIcon, Monitor } from "lucide-react"

interface QuickStatsProps {
  profile: UserProfile
}

export const QuickStats: React.FC<QuickStatsProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Program</span>
          </div>
          <span className="font-semibold text-foreground">{profile.program}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Interests</span>
          </div>
          <span className="font-semibold text-foreground">{profile.learningInterests.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZapIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-muted-foreground">Level</span>
          </div>
          <span className="font-semibold text-foreground capitalize">{profile.learningLevel}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-muted-foreground">Mode</span>
          </div>
          <span className="font-semibold text-foreground capitalize">{profile.preferredMode}</span>
        </div>
      </CardContent>
    </Card>
  )
}