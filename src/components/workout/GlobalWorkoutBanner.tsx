"use client";

import { useWorkoutStore } from "@/store/workout-store";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Clock } from "lucide-react";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function GlobalWorkoutBanner() {
  const store = useWorkoutStore();
  const pathname = usePathname();
  const router = useRouter();
  const [durationMs, setDurationMs] = useState(0);

  // If we are already on the active workout page, don't show the banner
  const isWorkoutPage = pathname === "/workout/active";

  useEffect(() => {
    if (!store.isActive || !store.startTime || isWorkoutPage) return;
    
    const timeout = setTimeout(() => {
      setDurationMs(Date.now() - store.startTime!);
    }, 0);
    
    const interval = setInterval(() => {
      setDurationMs(Date.now() - store.startTime!);
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [store.isActive, store.startTime, isWorkoutPage]);

  if (!store.isActive || isWorkoutPage) return null;

  return (
    <div 
      onClick={() => router.push("/workout/active")}
      className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg cursor-pointer flex items-center justify-between z-50 animate-in slide-in-from-bottom-5"
    >
      <div className="flex flex-col">
        <span className="font-semibold text-sm">Workout in Progress</span>
        <span className="text-xs opacity-90 truncate max-w-[150px]">{store.title}</span>
      </div>
      <div className="flex items-center font-bold text-lg">
        <Clock className="w-4 h-4 mr-1.5 animate-pulse" />
        {formatDuration(durationMs)}
      </div>
    </div>
  );
}
