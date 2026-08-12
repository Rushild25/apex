"use client";

import { useState } from "react";
import { useExercises } from "@/hooks/use-exercises";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Dumbbell, X } from "lucide-react";
import { useDebounce } from "use-debounce";

interface ExerciseResult {
  id: string;
  name: string;
  bodyPart: string | null;
  equipment: string | null;
  target: string | null;
}

interface ExerciseBrowserProps {
  onSelect?: (exercise: ExerciseResult) => void;
}

export function ExerciseBrowser({ onSelect }: ExerciseBrowserProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 250);
  const { data: exercises, isLoading } = useExercises({ search: debouncedSearch });

  return (
    <div className="flex flex-col h-full">
      {/* Search — always visible at top */}
      <div className="shrink-0 relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          autoFocus
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results — only this scrolls */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading exercises…</p>
          </div>
        ) : !exercises || exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Dumbbell className="w-8 h-8 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">
              {search ? `No results for "${search}"` : "No exercises found"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-lg border overflow-hidden">
            {exercises.map((ex) => (
              <li key={ex.id}>
                <div
                  onClick={() => onSelect?.(ex)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors bg-card ${
                    onSelect ? "cursor-pointer hover:bg-accent" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold uppercase text-muted-foreground">
                      {ex.name.substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{ex.name}</p>
                    <p className="text-xs text-muted-foreground capitalize truncate">
                      {[ex.bodyPart, ex.equipment].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
