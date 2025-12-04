import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { WeeklyStat } from "@/interfaces/progress.interfaces";

interface WeeklyActivityProps {
  weeklyStats: WeeklyStat[];
  maxHours: number;
}

export const WeeklyActivity: React.FC<WeeklyActivityProps> = ({ 
  weeklyStats, 
  maxHours 
}) => {
  const hasData = weeklyStats.some(stat => stat.hours > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Study Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyStats.map((stat) => (
              <div key={stat.day} className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-muted rounded-t-lg relative" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all"
                    style={{ height: `${(stat.hours / maxHours) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{stat.day}</span>
                <span className="text-xs font-medium">{stat.hours}h</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No study data for this week</p>
            <p className="text-sm text-muted-foreground">Complete sessions to see your weekly progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};