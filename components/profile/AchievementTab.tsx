import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserProfile, EarnedBadge } from "@/interfaces/profile.interfaces"
import { Award } from "lucide-react"

interface AchievementsTabProps {
  profile: UserProfile
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ profile }) => {
  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { bg: 'bg-gray-100', badge: 'secondary' as const }
      case 'rare':
        return { bg: 'bg-blue-100', badge: 'default' as const }
      case 'epic':
        return { bg: 'bg-purple-100', badge: 'outline' as const }
      case 'legendary':
        return { bg: 'bg-yellow-100', badge: 'default' as const, badgeClass: 'bg-yellow-100 text-yellow-800' }
      default:
        return { bg: 'bg-gray-100', badge: 'secondary' as const }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements & Badges</CardTitle>
        <p className="text-sm text-muted-foreground">
          Earn badges by completing sessions, helping others, and engaging with the platform
        </p>
      </CardHeader>
      <CardContent>
        {profile.earnedBadges && profile.earnedBadges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {profile.earnedBadges.map((earnedBadge: EarnedBadge) => {
              const styles = getRarityStyles(earnedBadge.badgeId.rarity)
              
              return (
                <div
                  key={earnedBadge.badgeId._id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${styles.bg}`}
                  >
                    <span className="text-lg">{earnedBadge.badgeId.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{earnedBadge.badgeId.name}</h4>
                      <Badge 
                        variant={styles.badge}
                        className={styles.badgeClass}
                      >
                        {earnedBadge.badgeId.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{earnedBadge.badgeId.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Earned on {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No badges yet</h3>
            <p className="text-muted-foreground mt-2">
              Complete sessions, help other students, and engage with the platform to earn badges!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}