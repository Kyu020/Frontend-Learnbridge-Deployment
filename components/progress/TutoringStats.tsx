import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface TutoringStatsProps {
  stats: {
    totalTutoredSessions: number;
    totalTutoredHours: number;
    totalTutoredMinutes: number;
    tutoringCourses: number;
  };
}

export const TutoringStats: React.FC<TutoringStatsProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Tutoring Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-sm">Sessions Tutored</p>
            <span className="text-sm text-muted-foreground">
              {stats.totalTutoredSessions} total
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((stats.totalTutoredSessions / 10) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.totalTutoredSessions / 10) * 100)}% of monthly goal
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-sm">Tutoring Hours</p>
            <span className="text-sm text-muted-foreground">
              {stats.totalTutoredHours}h total
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((stats.totalTutoredHours / 20) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalTutoredMinutes} minutes across {stats.tutoringCourses} courses
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-foreground">{stats.tutoringCourses}</p>
            <p className="text-xs text-muted-foreground">Courses Taught</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {stats.totalTutoredSessions > 0 ? Math.round(stats.totalTutoredMinutes / stats.totalTutoredSessions) : 0}
            </p>
            <p className="text-xs text-muted-foreground">Avg. Session (min)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};