"use client";

import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/store/workout-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play } from "lucide-react";

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
    <Button onClick={handleStart} disabled={isLoading} className="gap-2">
      <Play className="w-4 h-4" />
      {isLoading ? "Starting..." : "Quick Start Workout"}
    </Button>
  );
}


