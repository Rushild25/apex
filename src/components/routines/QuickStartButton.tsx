"use client";

import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/store/workout-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

export function QuickStartButton() {
  const store = useWorkoutStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    store.startWorkout(null, "Quick Start", []);
    router.push("/workout/active");
  };

  return (
    <Button
      onClick={handleStart}
      disabled={isLoading}
      className="w-full py-6 rounded-xl bg-card hover:bg-muted text-foreground border border-border/80 flex items-center justify-center gap-2.5 font-bold text-base shadow-sm transition-all active:scale-[0.99]"
      variant="outline"
    >
      <Plus className="w-5 h-5 text-primary stroke-[2.5px]" />
      {isLoading ? "Starting..." : "Start Empty Workout"}
    </Button>
  );
}


