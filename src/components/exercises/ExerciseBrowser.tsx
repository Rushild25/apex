"use client";

import React, { useState } from "react";
import { useExercises } from "@/hooks/use-exercises";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  Dumbbell,
  X,
  ArrowLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface ExerciseResult {
  id: string;
  name: string;
  bodyPart: string | null;
  equipment: string | null;
  target: string | null;
  gifUrl?: string | null;
}

interface ExerciseBrowserProps {
  onSelect?: (exercise: ExerciseResult) => void;
  showBackArrow?: boolean;
}

const MUSCLE_GROUPS = {
  "Upper Body": [
    "Abdominals",
    "Biceps",
    "Chest",
    "Forearms",
    "Lats",
    "Lower Back",
    "Neck",
    "Shoulders",
    "Traps",
    "Triceps",
    "Upper Back",
  ],
  "Lower Body": [
    "Abductors",
    "Adductors",
    "Calves",
    "Glutes",
    "Hamstrings",
    "Quadriceps",
  ],
  Other: ["Cardio", "Full Body", "Other"],
};

const EQUIPMENT_LIST = [
  "None",
  "Barbell",
  "Dumbbell",
  "Kettlebell",
  "Machine",
  "Plate",
  "Resistance Band",
  "Suspension Band",
  "Other",
];

export function ExerciseBrowser({ onSelect, showBackArrow = true }: ExerciseBrowserProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 250);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  // Modals
  const [isMuscleModalOpen, setIsMuscleModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create form state
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseMuscle, setNewExerciseMuscle] = useState("Chest");
  const [newExerciseEquipment, setNewExerciseEquipment] = useState("Dumbbell");
  const [isCreating, setIsCreating] = useState(false);

  const { data: exercises, isLoading, refetch } = useExercises({
    search: debouncedSearch,
    target: selectedMuscle || undefined,
    equipment: selectedEquipment || undefined,
  });

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) {
      toast.error("Please provide an exercise name");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newExerciseName.trim(),
          target: newExerciseMuscle,
          bodyPart: newExerciseMuscle,
          equipment: newExerciseEquipment,
        }),
      });

      if (!res.ok) throw new Error("Failed to create exercise");
      toast.success("Exercise created!");
      setIsCreateModalOpen(false);
      setNewExerciseName("");
      refetch();
    } catch (err) {
      toast.error("Failed to create exercise");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {showBackArrow && (
            <Link
              href="/workout"
              className="p-1.5 -ml-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <h1 className="text-xl font-bold tracking-tight text-foreground">Exercises</h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-sm font-bold text-[#0A84FF] hover:opacity-80 transition-opacity"
        >
          Create
        </button>
      </div>

      {/* Search Input */}
      <div className="shrink-0 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search exercise"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 bg-card border-border/70 rounded-xl text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Buttons (Screenshot 8) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setIsEquipmentModalOpen(true)}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors text-center truncate",
            selectedEquipment
              ? "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/40"
              : "bg-card text-foreground border-border/70 hover:bg-muted/60"
          )}
        >
          {selectedEquipment || "All Equipment"}
        </button>

        <button
          onClick={() => setIsMuscleModalOpen(true)}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors text-center truncate",
            selectedMuscle
              ? "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/40"
              : "bg-card text-foreground border-border/70 hover:bg-muted/60"
          )}
        >
          {selectedMuscle || "All Muscles"}
        </button>
      </div>

      {/* Exercises List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#0A84FF]" />
            <p className="text-xs text-muted-foreground">Loading exercises…</p>
          </div>
        ) : !exercises || exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Dumbbell className="w-10 h-10 text-muted-foreground opacity-30" />
            <p className="text-sm font-bold text-foreground">No exercises found</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Try adjusting your filters or search term, or create a custom exercise.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60 rounded-2xl bg-card border border-border/70 overflow-hidden shadow-sm">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => onSelect?.(ex)}
                className={cn(
                  "flex items-center justify-between p-3.5 hover:bg-muted/50 transition-colors cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-muted border border-border/60 flex items-center justify-center overflow-hidden shrink-0">
                    {ex.gifUrl ? (
                      <Image
                        src={ex.gifUrl}
                        alt={ex.name}
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    ) : (
                      <Dumbbell className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate">{ex.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize truncate">
                      {ex.target || ex.bodyPart || "General"}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Muscle Group Filter Bottom Sheet (Screenshots 5 & 6) */}
      {isMuscleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-lg bg-background border-t border-border rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
              <h3 className="font-bold text-base text-foreground">Muscle Group</h3>
              <button
                onClick={() => setIsMuscleModalOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {Object.entries(MUSCLE_GROUPS).map(([category, muscles]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {muscles.map((muscle) => {
                      const isSelected = selectedMuscle?.toLowerCase() === muscle.toLowerCase();
                      return (
                        <button
                          key={muscle}
                          onClick={() => {
                            setSelectedMuscle(isSelected ? null : muscle);
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border text-left font-bold text-xs transition-all",
                            isSelected
                              ? "bg-[#0A84FF]/15 border-[#0A84FF] text-[#0A84FF]"
                              : "bg-card border-border/70 text-foreground hover:bg-muted/50"
                          )}
                        >
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <span className="truncate">{muscle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border flex items-center gap-3 bg-background">
              <button
                onClick={() => {
                  setSelectedMuscle(null);
                  setIsMuscleModalOpen(false);
                }}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsMuscleModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#0A84FF] text-white text-xs font-bold shadow hover:bg-[#0A84FF]/90"
              >
                Show {exercises?.length ?? 0} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Filter Bottom Sheet (Screenshot 7) */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-lg bg-background border-t border-border rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
              <h3 className="font-bold text-base text-foreground">Equipment</h3>
              <button
                onClick={() => setIsEquipmentModalOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2.5">
                {EQUIPMENT_LIST.map((eq) => {
                  const isSelected = selectedEquipment?.toLowerCase() === eq.toLowerCase();
                  return (
                    <button
                      key={eq}
                      onClick={() => {
                        setSelectedEquipment(isSelected ? null : eq);
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border text-left font-bold text-xs transition-all",
                        isSelected
                          ? "bg-[#0A84FF]/15 border-[#0A84FF] text-[#0A84FF]"
                          : "bg-card border-border/70 text-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Dumbbell className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="truncate">{eq}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center gap-3 bg-background">
              <button
                onClick={() => {
                  setSelectedEquipment(null);
                  setIsEquipmentModalOpen(false);
                }}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsEquipmentModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#0A84FF] text-white text-xs font-bold shadow hover:bg-[#0A84FF]/90"
              >
                Show {exercises?.length ?? 0} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Exercise Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-background border border-border rounded-3xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">Create Exercise</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Exercise Name
                </label>
                <Input
                  placeholder="e.g. Incline DB Fly"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  className="bg-card border-border/70 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Muscle
                </label>
                <select
                  value={newExerciseMuscle}
                  onChange={(e) => setNewExerciseMuscle(e.target.value)}
                  className="w-full bg-card border border-border/70 rounded-xl p-3 text-sm font-semibold text-foreground outline-none"
                >
                  {Object.values(MUSCLE_GROUPS)
                    .flat()
                    .map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Equipment
                </label>
                <select
                  value={newExerciseEquipment}
                  onChange={(e) => setNewExerciseEquipment(e.target.value)}
                  className="w-full bg-card border border-border/70 rounded-xl p-3 text-sm font-semibold text-foreground outline-none"
                >
                  {EQUIPMENT_LIST.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 rounded-xl bg-[#0A84FF] text-white text-sm font-bold shadow hover:bg-[#0A84FF]/90 transition-all disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Save Exercise"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
