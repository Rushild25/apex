"use client";

import { ExerciseBrowser } from "@/components/exercises/ExerciseBrowser";

export default function ExercisesPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col h-full">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Exercises</h1>
        <p className="text-muted-foreground">Browse and search the exercise catalog.</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ExerciseBrowser />
      </div>
    </div>
  );
}
