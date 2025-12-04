import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, BookOpen, Award } from "lucide-react";

interface OverviewStatsProps {
  stats: {
    totalStudyHours: number;
    totalStudyMinutes: number;
    totalSessions: number;
    totalResources: number;
    achievements: number;
  };
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: "Total Study Time",
      value: `${stats.totalStudyHours}h`,
      description: `${stats.totalStudyMinutes} minutes total`,
      icon: Clock,
      iconColor: "text-blue-600",
      textColor: "text-green-600",
    },
    {
      label: "Completed Sessions",
      value: stats.totalSessions.toString(),
      description: "Across multiple courses",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      textColor: "text-green-600",
    },
    {
      label: "Resources Viewed",
      value: stats.totalResources.toString(),
      description: "Learning materials accessed",
      icon: BookOpen,
      iconColor: "text-purple-600",
      textColor: "text-muted-foreground",
    },
    {
      label: "Achievements",
      value: stats.achievements.toString(),
      description: "Based on your progress",
      icon: Award,
      iconColor: "text-yellow-600",
      textColor: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className={`text-xs ${card.textColor} mt-1`}>
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};