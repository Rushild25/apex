"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Share2,
  Award,
  Flame,
  ChevronDown,
  ChevronRight,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface MonthlyPRItem {
  exerciseName: string;
  records: { type: string; value: string }[];
}

export interface MonthlyExerciseItem {
  name: string;
  count: number;
  gifUrl?: string | null;
}

export interface MonthlyMuscleItem {
  name: string;
  sets: number;
}

interface MonthlyReportClientProps {
  monthName: string;
  year: number;
  userName: string;
  summary: {
    workouts: number;
    durationSec: number;
    volumeKg: number;
    sets: number;
  };
  prs: MonthlyPRItem[];
  streakWeeks: number;
  activeCalendarDays: number[];
  daysInMonth: number;
  muscleGroups: MonthlyMuscleItem[];
  topExercises: MonthlyExerciseItem[];
}

export function MonthlyReportClient({
  monthName,
  year,
  userName,
  summary,
  prs,
  streakWeeks,
  activeCalendarDays,
  daysInMonth,
  muscleGroups,
  topExercises,
}: MonthlyReportClientProps) {
  const [metric, setMetric] = useState<"workouts" | "duration" | "volume" | "sets">("sets");
  const [showAllMuscles, setShowAllMuscles] = useState(false);
  const [showAllPRs, setShowAllPRs] = useState(false);
  const [showAllExercises, setShowAllExercises] = useState(false);

  const formatDuration = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs}h ${mins}min`;
  };

  const formatVolume = (kg: number) => {
    const k = Math.round(kg / 1000);
    return k > 0 ? `${k}k kg` : `${Math.round(kg)} kg`;
  };

  const getMetricHeader = () => {
    switch (metric) {
      case "workouts":
        return `${summary.workouts}`;
      case "duration":
        return formatDuration(summary.durationSec);
      case "volume":
        return formatVolume(summary.volumeKg);
      case "sets":
        return `${summary.sets}`;
    }
  };

  const months = ["S", "O", "N", "D", "J", "F", "M", "A", "M", "J", "J", "A"];

  const handleShare = async () => {
    const shareData = {
      title: `${userName}'s ${monthName} Recap on APEX`,
      text: `Crushed ${monthName} on APEX! ${summary.workouts} workouts, ${formatDuration(summary.durationSec)}, and ${formatVolume(summary.volumeKg)} volume lifted!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Monthly report copied to clipboard!");
    }
  };

  const displayedMuscles = showAllMuscles ? muscleGroups : muscleGroups.slice(0, 6);
  const maxMuscleSets = Math.max(...muscleGroups.map((m) => m.sets), 10);

  const displayedPRs = showAllPRs ? prs : prs.slice(0, 3);
  const displayedExercises = showAllExercises ? topExercises : topExercises.slice(0, 6);

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-8 pb-32">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/statistics"
          className="p-1.5 -ml-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{monthName} Report</h1>
      </div>

      {/* Main Metric & 12-Month Bar Chart (Screenshots 9, 10, 11, 19) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {monthName} {year}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-foreground">{getMetricHeader()}</span>
            <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{getMetricHeader()}</span>
            </div>
          </div>
        </div>

        {/* 12-Month Bar Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-1.5 pt-4 pb-2 border-b border-border/50">
          {months.map((m, i) => {
            const isCurrentMonth = i === months.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                <div
                  style={{ height: isCurrentMonth ? "90%" : "5%" }}
                  className={cn(
                    "w-full rounded-t-sm transition-all",
                    isCurrentMonth ? "bg-[#0A84FF]" : "bg-muted/40"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis Month initials */}
        <div className="flex justify-between text-[11px] text-muted-foreground font-bold px-1">
          {months.map((m, i) => (
            <span key={i} className={i === months.length - 1 ? "text-[#0A84FF]" : ""}>
              {m}
            </span>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {(["workouts", "duration", "volume", "sets"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setMetric(item)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold capitalize transition-all",
                metric === item
                  ? "bg-[#0A84FF] text-white shadow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Summary 2x2 Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Summary
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground">Workouts</span>
            <span className="block text-2xl font-black text-foreground">{summary.workouts}</span>
            <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{summary.workouts}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground">Duration</span>
            <span className="block text-2xl font-black text-foreground">
              {formatDuration(summary.durationSec)}
            </span>
            <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{formatDuration(summary.durationSec)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground">Volume</span>
            <span className="block text-2xl font-black text-foreground">
              {formatVolume(summary.volumeKg)}
            </span>
            <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{formatVolume(summary.volumeKg)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground">Sets</span>
            <span className="block text-2xl font-black text-foreground">{summary.sets}</span>
            <div className="flex items-center gap-0.5 text-xs text-emerald-500 font-bold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{summary.sets}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Records Section (Screenshot 18) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Personal Records
        </h3>

        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mb-2">
            <Award className="w-8 h-8 fill-amber-400" />
          </div>
          <span className="text-xl font-black text-foreground">
            {prs.reduce((acc, curr) => acc + curr.records.length, 0)} new PRs
          </span>
        </div>

        {prs.length > 0 && (
          <div className="space-y-3">
            <div className="divide-y divide-border/60 rounded-2xl bg-card border border-border/70 overflow-hidden shadow-sm">
              {displayedPRs.map((item) => (
                <div key={item.exerciseName} className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-foreground">{item.exerciseName}</h4>
                  <div className="space-y-1.5 pl-1">
                    {item.records.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        <span className="text-amber-400 font-bold">{r.type}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-bold">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {prs.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllPRs(!showAllPRs)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  {showAllPRs ? "See less" : `See ${prs.length - 3} more`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workout Days Log (Streak & Calendar) (Screenshot 17) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Workout Days Log
        </h3>

        <div className="rounded-3xl bg-card border border-border/70 p-5 space-y-4 shadow-sm text-center">
          <div className="flex flex-col items-center">
            <Flame className="w-10 h-10 text-orange-500 fill-orange-500 mb-1" />
            <span className="text-xl font-black text-foreground">{streakWeeks} Week Streak</span>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground/80 py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 text-center">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const hasWorkout = activeCalendarDays.includes(d);
              return (
                <div key={d} className="flex items-center justify-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      hasWorkout
                        ? "bg-[#0A84FF] text-white shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    {d}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Muscle Groups Bar Breakdown (Screenshots 14 & 15) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Main Muscle Groups
        </h3>

        <div className="rounded-3xl bg-card border border-border/70 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pb-2 border-b border-border/50">
            <span>Muscle</span>
            <span>Sets</span>
          </div>

          <div className="space-y-3.5">
            {displayedMuscles.map((m) => {
              const barWidth = Math.max((m.sets / maxMuscleSets) * 100, 8);
              return (
                <div key={m.name} className="flex items-center justify-between gap-4 text-xs font-bold">
                  <span className="w-24 text-foreground truncate">{m.name}</span>
                  <div className="flex-1 h-3.5 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className="h-full rounded-full bg-[#0A84FF]"
                    />
                  </div>
                  <span className="w-8 text-right text-foreground">{m.sets}</span>
                </div>
              );
            })}
          </div>

          {muscleGroups.length > 6 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAllMuscles(!showAllMuscles)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                {showAllMuscles ? "See less" : `See ${muscleGroups.length - 6} more`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top Exercises for the Month (Screenshots 12 & 13) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Top Exercises
        </h3>

        <div className="divide-y divide-border/60 rounded-2xl bg-card border border-border/70 overflow-hidden shadow-sm">
          {displayedExercises.map((ex) => (
            <div key={ex.name} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-muted border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                  {ex.gifUrl ? (
                    <Image src={ex.gifUrl} alt={ex.name} width={44} height={44} className="object-cover" />
                  ) : (
                    <Dumbbell className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate">{ex.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ex.count} {ex.count === 1 ? "time" : "times"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>

        {topExercises.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllExercises(!showAllExercises)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              {showAllExercises ? "See less" : `See ${topExercises.length - 6} more`}
            </button>
          </div>
        )}
      </div>

      {/* Congratulatory Celebration Card (Screenshot 12) */}
      <div className="p-6 rounded-3xl bg-card border border-border/70 text-center space-y-2 shadow-sm">
        <h3 className="text-lg font-black text-foreground">
          Congrats on a great month {userName}! 👏
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Celebrate your achievements and motivate others by sharing your journey!
        </p>
      </div>

      {/* Sticky Bottom Share Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur border-t border-border z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-xl bg-[#0A84FF] text-white font-bold text-sm shadow flex items-center justify-center gap-2 hover:bg-[#0A84FF]/90 transition-all active:scale-[0.99]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
