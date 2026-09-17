"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { AnatomyBodyMap } from "@/components/statistics/AnatomyBodyMap";
import { startOfWeek, endOfWeek, addDays, addWeeks, format, isSameDay } from "date-fns";

export const MUSCLE_LIST = [
  "Abdominals",
  "Abductors",
  "Adductors",
  "Biceps",
  "Calves",
  "Cardio",
  "Chest",
  "Forearms",
  "Full Body",
  "Glutes",
  "Hamstrings",
  "Lats",
  "Lower Back",
  "Neck",
  "Quadriceps",
  "Shoulders",
  "Traps",
  "Triceps",
  "Upper Back",
  "Other",
];

export interface SerializedWorkoutExercise {
  name: string;
  target?: string | null;
  bodyPart?: string | null;
  setsCount: number;
}

export interface SerializedWorkout {
  id: string;
  completedAt: string;
  exercises: SerializedWorkoutExercise[];
}

interface BodyDistributionClientProps {
  workouts: SerializedWorkout[];
}

function formatWeekRange(start: Date, end: Date) {
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "d")}-${format(end, "d MMMM yyyy")}`;
  }
  return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
}

export function BodyDistributionClient({ workouts }: BodyDistributionClientProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const baseDate = useMemo(() => new Date(), []);
  
  const currentWeekStart = useMemo(() => {
    return startOfWeek(addWeeks(baseDate, weekOffset), { weekStartsOn: 0 }); // Sunday
  }, [baseDate, weekOffset]);

  const currentWeekEnd = useMemo(() => {
    return endOfWeek(currentWeekStart, { weekStartsOn: 0 });
  }, [currentWeekStart]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const weekWorkouts = useMemo(() => {
    const startTime = currentWeekStart.getTime();
    const endTime = currentWeekEnd.getTime();
    return workouts.filter((w) => {
      const t = new Date(w.completedAt).getTime();
      return t >= startTime && t <= endTime;
    });
  }, [workouts, currentWeekStart, currentWeekEnd]);

  // Calculate sets per muscle for this selected week
  const { muscleSets, totalSets } = useMemo(() => {
    const setsMap: Record<string, number> = {};
    let total = 0;

    for (const m of MUSCLE_LIST) {
      setsMap[m] = 0;
    }

    for (const w of weekWorkouts) {
      for (const we of w.exercises) {
        const target = we.target || we.bodyPart || "Other";
        const count = we.setsCount;
        total += count;

        const matchedMuscle = MUSCLE_LIST.find((m) =>
          target.toLowerCase().includes(m.toLowerCase())
        );
        if (matchedMuscle) {
          setsMap[matchedMuscle] = (setsMap[matchedMuscle] ?? 0) + count;
        } else {
          setsMap["Other"] = (setsMap["Other"] ?? 0) + count;
        }
      }
    }

    return { muscleSets: setsMap, totalSets: total };
  }, [weekWorkouts]);

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6 pb-24 md:pb-12 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/statistics"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Body distribution</h1>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <HelpCircle className="w-5 h-5 cursor-pointer hover:text-foreground" />
          <Share2 className="w-5 h-5 cursor-pointer hover:text-foreground" />
        </div>
      </div>

      {/* Week Selector with interactive Prev / Next controls */}
      <div className="flex items-center justify-between text-sm font-bold text-foreground px-2">
        <button
          onClick={handlePrevWeek}
          aria-label="Previous week"
          id="btn-prev-week"
          className="p-1.5 rounded-full hover:bg-muted text-[#0A84FF] hover:scale-110 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-bold tracking-wide select-text">
          {formatWeekRange(currentWeekStart, currentWeekEnd)}
        </span>

        <button
          onClick={handleNextWeek}
          aria-label="Next week"
          id="btn-next-week"
          className="p-1.5 rounded-full hover:bg-muted text-[#0A84FF] hover:scale-110 active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday strip */}
      <div className="grid grid-cols-7 gap-1 text-center py-1">
        {days.map((day) => {
          const hasWorkout = weekWorkouts.some((w) =>
            isSameDay(new Date(w.completedAt), day)
          );

          return (
            <div key={day.toISOString()} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {format(day, "ccccc")}
              </span>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  hasWorkout ? "bg-[#0A84FF] text-white shadow" : "text-muted-foreground bg-muted/40"
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Anatomy Heat Map */}
      <div className="rounded-3xl bg-card border border-border/70 p-4 shadow-sm">
        <AnatomyBodyMap activeMuscles={muscleSets} />
      </div>

      {/* Muscle Breakdown Table */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1 border-b border-border/50">
          <span>Muscle</span>
          <span>Sets</span>
        </div>

        <div className="flex items-center justify-between py-3 px-2 font-black text-base border-b border-border/80">
          <span>Total</span>
          <span className="text-[#0A84FF]">{totalSets}</span>
        </div>

        <div className="divide-y divide-border/40">
          {MUSCLE_LIST.map((muscle) => {
            const count = muscleSets[muscle] || 0;
            return (
              <div key={muscle} className="flex items-center justify-between py-3 px-2 text-sm">
                <span className={count > 0 ? "font-bold text-foreground" : "text-muted-foreground"}>
                  {muscle}
                </span>
                <span className={count > 0 ? "font-bold text-foreground" : "text-muted-foreground"}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
