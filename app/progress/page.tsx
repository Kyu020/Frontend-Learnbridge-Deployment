"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { OverviewStats } from "@/components/progress/OverviewStats";
import { TutoringStats } from "@/components/progress/TutoringStats";
import { WeeklyActivity } from "@/components/progress/WeeklyActivity";
import { RecentActivity } from "@/components/progress/RecentActivity";
import { LoadingState } from "@/components/progress/LoadingState";
import { ErrorState } from "@/components/progress/ErrorState";
import { EmptyState } from "@/components/progress/EmptyState";
import { useProgress } from "@/hooks/useProgress";
import { RefreshCw } from "lucide-react";

export default function ProgressPage() {
  const {
    progressData,
    loading,
    error,
    stats,
    weeklyStats,
    formattedActivities,
    maxHours,
    refetch,
  } = useProgress();

  if (loading) {
    return (
      <LayoutWrapper>
        <LoadingState />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <ErrorState error={error} onRetry={refetch} />
      </LayoutWrapper>
    );
  }

  if (!progressData || !stats) {
    return (
      <LayoutWrapper>
        <EmptyState onRetry={refetch} />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Learning Progress</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your learning journey and achievements</p>
        </div>
        <button 
          onClick={refetch}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <OverviewStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TutoringStats stats={stats} />
        <WeeklyActivity weeklyStats={weeklyStats} maxHours={maxHours} />
      </div>

      <div className="mt-6">
        <RecentActivity activities={formattedActivities} />
      </div>
    </LayoutWrapper>
  );
}