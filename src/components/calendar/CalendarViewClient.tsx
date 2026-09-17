"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Share2,
  SlidersHorizontal,
  Flame,
  Moon,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface CalendarWorkoutItem {
  id: string;
  title: string;
  completedAt: string;
  durationSec: number | null;
  totalVolume: number;
  exercisesCount: number;
}

interface CalendarViewClientProps {
  workouts: CalendarWorkoutItem[];
  currentStreakWeeks: number;
  restDaysCount: number;
}

export function CalendarViewClient({
  workouts,
  currentStreakWeeks,
  restDaysCount,
}: CalendarViewClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Find workout on a given day
  const getWorkoutForDay = (day: Date) => {
    return workouts.find((w) => isSameDay(new Date(w.completedAt), day));
  };

  const selectedWorkout = selectedDate ? getWorkoutForDay(selectedDate) : null;

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-1.5 font-bold text-lg cursor-pointer">
            <span>Month</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Calendar link copied!");
            }}
            className="p-2 rounded-full hover:bg-muted hover:text-foreground transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => toast("Calendar filter options")}
            className="p-2 rounded-full hover:bg-muted hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Streak and Rest Day Stats */}
      <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-2xl bg-card border border-border/70 shadow-sm">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="font-bold text-sm text-foreground">
            {currentStreakWeeks} week streak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-[#0A84FF] fill-[#0A84FF]" />
          <span className="font-bold text-sm text-foreground">
            {restDaysCount} rest {restDaysCount === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      {/* Month Navigation & Title */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-black text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground/80 py-1">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
        {/* Leading empty cells */}
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="h-14" />
        ))}

        {days.map((day) => {
          const workout = getWorkoutForDay(day);
          const hasWorkout = !!workout;
          const isSelected = selectedDate && isSameDay(selectedDate, day);

          // Extract routine day tag or short name (e.g., "Monday -")
          let tag = "";
          if (workout) {
            const firstWord = workout.title.split(/[\s-]+/)[0];
            tag = firstWord ? `${firstWord} -` : "Workout";
          }

          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center justify-start h-14 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  hasWorkout
                    ? "bg-[#0A84FF] text-white shadow-sm"
                    : "text-foreground group-hover:bg-muted/60",
                  isSelected && !hasWorkout && "border-2 border-primary"
                )}
              >
                {format(day, "d")}
              </div>
              {hasWorkout && (
                <span className="text-[9px] text-muted-foreground truncate max-w-[48px] mt-0.5 leading-none">
                  {tag}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Workout Details Card */}
      {selectedDate && (
        <div className="mt-6 p-4 rounded-2xl bg-card border border-border/70 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            {selectedWorkout && (
              <span className="text-xs bg-[#0A84FF]/10 text-[#0A84FF] font-bold px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>

          {selectedWorkout ? (
            <div className="space-y-2">
              <h4 className="font-bold text-base text-foreground">{selectedWorkout.title}</h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedWorkout.durationSec
                    ? `${Math.floor(selectedWorkout.durationSec / 60)} min`
                    : "Untimed"}
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" />
                  {Math.round(selectedWorkout.totalVolume).toLocaleString()} kg
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {selectedWorkout.exercisesCount} exercises
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground py-2 flex items-center gap-2">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <span>Rest day — No workout logged on this date.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
