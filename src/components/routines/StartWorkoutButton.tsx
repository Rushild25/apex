"use client";

import { Button } from "@/components/ui/button";
import { useWorkoutStore, ActiveWorkoutExercise } from "@/store/workout-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Prisma } from "@prisma/client";

type RoutineWithExercises = Prisma.RoutineGetPayload<{
  include: { exercises: { include: { exercise: true; sets: true } } }
}>;

interface StartWorkoutButtonProps {
  routine: RoutineWithExercises;
}

export function StartWorkoutButton({ routine }: StartWorkoutButtonProps) {
  const store = useWorkoutStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    
    const exercises: ActiveWorkoutExercise[] = routine.exercises.map((re) => ({
      id: Math.random().toString(36).substring(2, 15),
      exerciseId: re.exerciseId,
      name: re.exercise.name,
      bodyPart: re.exercise.bodyPart,
      target: re.exercise.target,
      equipment: re.exercise.equipment,
      category: re.exercise.category,
      order: re.order,
      restSeconds: re.restSeconds,
      sets: re.sets.map((set) => ({
        id: Math.random().toString(36).substring(2, 15),
        order: set.order,
        setType: set.setType,
        reps: set.targetReps ? parseInt(set.targetReps, 10) : null,
        weight: set.targetWeight,
        isCompleted: false,
      }))
    }));

    store.startWorkout(routine.id, routine.name, exercises);
    router.push("/workout/active");
  };

  return (
    <Button
      className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white font-bold py-2.5 rounded-xl shadow transition-all active:scale-[0.99]"
      onClick={handleStart}
      disabled={isLoading}
    >
      {isLoading ? "Starting..." : "Start Routine"}
    </Button>
  );
}
