"use client";

import React, { useState } from "react";
import {
  Pencil,
  Share2,
  Settings,
  Dumbbell,
  Calendar,
  LineChart,
  Scale,
  Award,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { WorkoutFeedCard, FeedWorkout } from "@/components/feed/WorkoutFeedCard";
import { cn } from "@/lib/utils";

interface WeeklyDataPoint {
  label: string; // e.g., "Aug 16"
  reps: number;
  volumeKg: number;
  durationHours: number;
}

interface ProfileDashboardClientProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  workoutCount: number;
  followersCount: number;
  followingCount: number;
  weeklyData: WeeklyDataPoint[];
  workouts: FeedWorkout[];
}

export function ProfileDashboardClient({
  user,
  workoutCount,
  followersCount,
  followingCount,
  weeklyData,
  workouts,
}: ProfileDashboardClientProps) {
  const [metric, setMetric] = useState<"reps" | "volume" | "duration">("reps");
  const [timeRange, setTimeRange] = useState<string>("Last 3 months");

  // Current week value (last item in weeklyData)
  const currentWeek = weeklyData[weeklyData.length - 1] || {
    reps: 0,
    volumeKg: 0,
    durationHours: 0,
  };

  // Find maximum value for the chart scale
  const getMaxValue = () => {
    if (metric === "reps") {
      return Math.max(...weeklyData.map((d) => d.reps), 100);
    }
    if (metric === "volume") {
      return Math.max(...weeklyData.map((d) => d.volumeKg), 1000);
    }
    return Math.max(...weeklyData.map((d) => d.durationHours), 5);
  };

  const maxVal = getMaxValue();

  const getMetricHeading = () => {
    if (metric === "reps") {
      return `${currentWeek.reps.toLocaleString()} Reps this week`;
    }
    if (metric === "volume") {
      const volK = Math.round(currentWeek.volumeKg / 1000);
      return `${volK > 0 ? `${volK}k` : Math.round(currentWeek.volumeKg)} kg this week`;
    }
    const hrs = Math.round(currentWeek.durationHours);
    return `${hrs} ${hrs === 1 ? "hour" : "hours"} this week`;
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {user.name || "rushild2"}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <button
            onClick={() => toast("Profile editing coming soon")}
            className="p-2 rounded-full hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={handleShareProfile}
            className="p-2 rounded-full hover:bg-muted hover:text-foreground transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Profile Bio / Stats */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-primary/30 border-2 border-border flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User Avatar"}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <Dumbbell className="w-9 h-9 text-primary" />
          )}
        </div>

        <div className="flex-1 grid grid-cols-3 text-center">
          <div>
            <span className="block text-xl font-black text-foreground">{workoutCount}</span>
            <span className="text-xs text-muted-foreground font-medium">Workouts</span>
          </div>
          <div>
            <span className="block text-xl font-black text-foreground">{followersCount}</span>
            <span className="text-xs text-muted-foreground font-medium">Followers</span>
          </div>
          <div>
            <span className="block text-xl font-black text-foreground">{followingCount}</span>
            <span className="text-xs text-muted-foreground font-medium">Following</span>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart Card */}
      <div className="rounded-2xl bg-card border border-border/70 p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">{getMetricHeading()}</h2>
          <div className="flex items-center gap-1 text-xs text-[#0A84FF] font-semibold cursor-pointer">
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 pb-2 border-b border-border/50">
          {weeklyData.map((d, i) => {
            const val =
              metric === "reps" ? d.reps : metric === "volume" ? d.volumeKg : d.durationHours;
            const heightPercent = maxVal > 0 ? Math.max((val / maxVal) * 100, 4) : 4;
            const hasData = val > 0;

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div
                  style={{ height: `${hasData ? heightPercent : 4}%` }}
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-300",
                    hasData ? "bg-[#0A84FF] group-hover:bg-[#0A84FF]/80" : "bg-muted/40"
                  )}
                  title={`${d.label}: ${val}`}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-[10px] text-muted-foreground px-1 font-medium">
          {weeklyData
            .filter((_, i) => i % 2 === 0 || i === weeklyData.length - 1)
            .map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
        </div>

        {/* Metric Switcher Pills */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setMetric("duration")}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold transition-all",
              metric === "duration"
                ? "bg-[#0A84FF] text-white shadow"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Duration
          </button>
          <button
            onClick={() => setMetric("volume")}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold transition-all",
              metric === "volume"
                ? "bg-[#0A84FF] text-white shadow"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Volume
          </button>
          <button
            onClick={() => setMetric("reps")}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold transition-all",
              metric === "reps"
                ? "bg-[#0A84FF] text-white shadow"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            Reps
          </button>
        </div>
      </div>

      {/* 2x2 Dashboard Quick-Access Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Dashboard
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/statistics"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/70 hover:bg-muted/60 transition-colors shadow-sm"
          >
            <LineChart className="w-5 h-5 text-foreground" />
            <span className="font-bold text-sm text-foreground">Statistics</span>
          </Link>

          <Link
            href="/exercises"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/70 hover:bg-muted/60 transition-colors shadow-sm"
          >
            <Dumbbell className="w-5 h-5 text-foreground" />
            <span className="font-bold text-sm text-foreground">Exercises</span>
          </Link>

          <Link
            href="/measures"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/70 hover:bg-muted/60 transition-colors shadow-sm"
          >
            <Scale className="w-5 h-5 text-foreground" />
            <span className="font-bold text-sm text-foreground">Measures</span>
          </Link>

          <Link
            href="/calendar"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/70 hover:bg-muted/60 transition-colors shadow-sm"
          >
            <Calendar className="w-5 h-5 text-foreground" />
            <span className="font-bold text-sm text-foreground">Calendar</span>
          </Link>
        </div>
      </div>

      {/* Personal Workouts Feed */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Workouts
        </h3>

        {workouts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/70 text-sm text-muted-foreground">
            No workouts logged yet.
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((w) => (
              <WorkoutFeedCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
