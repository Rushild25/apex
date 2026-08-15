"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "@/store/workout-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { finalizeWorkout, getPreviousExerciseStats } from "@/app/actions/workouts";
import { Check, Plus, Trash2, Clock, Search, X, Loader2, Dumbbell, RefreshCw } from "lucide-react";
import { useExercises } from "@/hooks/use-exercises";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function ActiveWorkoutLogger() {
  const router = useRouter();
  const store = useWorkoutStore();
  const [durationMs, setDurationMs] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 250);
  const { data: searchResults, isLoading: searchLoading } = useExercises({ search: debouncedSearch });
  
  // UX Overhaul: State for previous stats
  const [previousStats, setPreviousStats] = useState<Record<string, { weight: number | null, reps: number | null }[]>>({});
  const [replaceExerciseId, setReplaceExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (!store.isActive || !store.startTime) return;
    
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
  }, [store.isActive, store.startTime]);

  // UX Overhaul: Fetch previous stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!store.isActive) return;
      
      const newStats = { ...previousStats };
      let updated = false;
      
      for (const ex of store.exercises) {
        if (!newStats[ex.exerciseId]) {
          const stats = await getPreviousExerciseStats(ex.exerciseId);
          if (stats) {
            newStats[ex.exerciseId] = stats;
            updated = true;
          }
        }
      }
      if (updated) {
        setPreviousStats(newStats);
      }
    };
    
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.exercises, store.isActive]);

  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!store.restTimer?.isActive) {
      const timeout = setTimeout(() => setRestRemaining(null), 0);
      return () => clearTimeout(timeout);
    }
    
    const interval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - store.restTimer!.startTime) / 1000);
      const remaining = store.restTimer!.durationSec - elapsedSec;
      
      if (remaining <= 0) {
        store.clearRestTimer();
        setRestRemaining(null);
      } else {
        setRestRemaining(remaining);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [store.restTimer?.isActive, store.restTimer?.startTime, store.restTimer?.durationSec]);

  if (!store.isActive) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold mb-4">No active workout</h2>
        <Button onClick={() => router.push("/routines")}>Go to Routines</Button>
      </div>
    );
  }

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        routineId: store.routineId,
        title: store.title,
        startTime: store.startTime!,
        endTime: Date.now(),
        exercises: store.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          name: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
          category: ex.category,
          order: ex.order,
          sets: ex.sets.map(s => ({
            setType: s.setType,
            reps: s.reps,
            weight: s.weight,
            isCompleted: s.isCompleted,
            order: s.order
          }))
        }))
      };

      await finalizeWorkout(payload);
      store.endWorkout();
      router.push("/history");
    } catch (e: unknown) {
      alert((e as Error).message || "Failed to save workout");
      setIsSubmitting(false);
    }
  };

  const handleAddExercise = (ex: any) => {
    const exercisePayload = {
      exerciseId: ex.id,
      name: ex.name,
      bodyPart: ex.bodyPart ?? null,
      equipment: ex.equipment ?? null,
      category: ex.category ?? null,
      target: ex.target ?? null,
      restSeconds: null
    };

    if (replaceExerciseId) {
      store.replaceExercise(replaceExerciseId, exercisePayload);
      setReplaceExerciseId(null);
    } else {
      store.addExercise(exercisePayload);
    }
    setShowSearch(false);
    setSearch("");
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-32 relative">
      <div className="sticky top-0 bg-background/95 backdrop-blur z-30 flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">{store.title}</h1>
          <div className="text-sm text-primary font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatDuration(durationMs)}
          </div>
        </div>
        <Button onClick={handleFinish} disabled={isSubmitting} className="shadow-[var(--shadow-neon)] font-bold px-6">
          {isSubmitting ? "Finishing..." : "Finish"}
        </Button>
      </div>

      <div className="p-2 space-y-6 mt-4 relative z-10">
        {store.exercises.map((ex) => (
          <div key={ex.id} className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm">
            <div className="p-3 flex items-center justify-between bg-muted/20">
              <h3 className="font-bold text-primary">{ex.name}</h3>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" 
                  onClick={() => {
                    setReplaceExerciseId(ex.id);
                    setShowSearch(true);
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors" onClick={() => store.removeExercise(ex.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-2">
              <div className="grid grid-cols-[30px_1fr_65px_65px_45px] gap-2 mb-2 px-1 text-xs font-semibold text-muted-foreground uppercase text-center items-center">
                <div className="text-center">Set</div>
                <div className="text-left pl-2">Previous</div>
                <div>kg</div>
                <div>Reps</div>
                <div className="flex justify-center"><Check className="w-4 h-4" /></div>
              </div>

              <div className="space-y-2">
                {ex.sets.map((set, setIdx) => {
                  const prevStats = previousStats[ex.exerciseId]?.[setIdx];
                  const prevText = prevStats ? `${prevStats.weight ?? '-'}kg x ${prevStats.reps ?? '-'}` : '-';

                  return (
                    <div 
                      key={set.id} 
                      className={cn(
                        "grid grid-cols-[30px_1fr_65px_65px_45px] gap-2 items-center rounded-lg p-1.5 transition-all duration-300",
                        set.isCompleted ? "bg-primary/5 opacity-80" : "bg-muted/20"
                      )}
                    >
                      <div className="text-center font-bold text-sm text-muted-foreground">
                        {set.setType === 'WARMUP' ? 'W' : set.setType === 'DROPSET' ? 'D' : set.setType === 'FAILURE' ? 'F' : setIdx + 1}
                      </div>
                      
                      <div className={cn("text-xs font-medium truncate pl-2", set.isCompleted ? "text-muted-foreground line-through" : "text-muted-foreground/80")}>
                        {prevText}
                      </div>
                      
                      <div>
                        <Input
                          type="number"
                          placeholder="0"
                          className={cn("h-10 text-center text-lg font-bold bg-background", set.isCompleted && "bg-transparent border-transparent text-muted-foreground")}
                          value={set.weight ?? ""}
                          onChange={(e) => store.updateSet(ex.id, set.id, { weight: e.target.value ? parseFloat(e.target.value) : null })}
                          disabled={set.isCompleted}
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="number"
                          placeholder="0"
                          className={cn("h-10 text-center text-lg font-bold bg-background", set.isCompleted && "bg-transparent border-transparent text-muted-foreground")}
                          value={set.reps ?? ""}
                          onChange={(e) => store.updateSet(ex.id, set.id, { reps: e.target.value ? parseInt(e.target.value) : null })}
                          disabled={set.isCompleted}
                        />
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          type="button"
                          className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 border-2",
                            set.isCompleted 
                              ? "bg-primary border-primary text-black shadow-[var(--shadow-neon)]" 
                              : "bg-transparent border-muted-foreground/30 text-transparent hover:border-primary/50"
                          )}
                          onClick={() => store.toggleSetComplete(ex.id, set.id, ex.restSeconds)}
                        >
                          <Check className={cn("w-5 h-5", set.isCompleted ? "text-black" : "text-transparent")} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 text-primary font-bold hover:bg-primary/10 transition-colors"
                onClick={() => store.addSet(ex.id)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Set
              </Button>
            </div>
          </div>
        ))}

        {/* Add / Replace Exercise — inline search */}
        {showSearch ? (
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
            {/* Search bar */}
            <div className="p-3 border-b flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  autoFocus
                  placeholder="Search exercises…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 text-base"
                />
              </div>
              <button onClick={() => { setShowSearch(false); setSearch(""); setReplaceExerciseId(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : !searchResults || searchResults.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2">
                  <Dumbbell className="w-8 h-8 text-muted-foreground opacity-40" />
                  <p className="text-sm text-muted-foreground">{search ? `No results for "${search}"` : "Search for an exercise"}</p>
                </div>
              ) : (
                <ul className="divide-y divide-border/50">
                  {searchResults.map((ex) => (
                    <li key={ex.id}>
                      <button
                        type="button"
                        onClick={() => handleAddExercise(ex)}
                        className="w-full flex items-center gap-4 px-4 py-4 hover:bg-primary/10 text-left transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center border border-border/50">
                          <span className="text-xs font-bold uppercase text-muted-foreground">{ex.name.substring(0, 2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold truncate">{ex.name}</p>
                          <p className="text-xs text-muted-foreground capitalize truncate">{[ex.bodyPart, ex.equipment].filter(Boolean).join(" · ")}</p>
                        </div>
                        {replaceExerciseId ? (
                          <RefreshCw className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full h-14 border-dashed border-primary/50 text-primary font-bold hover:bg-primary/5 hover:border-primary transition-colors"
            onClick={() => {
              setReplaceExerciseId(null);
              setShowSearch(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" /> Add Exercise
          </Button>
        )}
        
        <div className="pt-8 pb-4 text-center flex flex-col gap-2 items-center">
          <Button variant="ghost" className="text-destructive font-semibold hover:bg-destructive/10" onClick={() => {
            if(confirm("Are you sure you want to cancel this workout?")) {
              store.endWorkout();
              router.push("/routines");
            }
          }}>
            Cancel Workout
          </Button>
        </div>
      </div>

      {/* Floating Rest Timer Pill */}
      {restRemaining !== null && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-primary text-black rounded-full px-5 py-2.5 flex items-center gap-4 shadow-[var(--shadow-neon)] font-bold">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-xl tabular-nums tracking-tight">
              {formatDuration(restRemaining * 1000)}
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 px-3 text-xs bg-black/10 hover:bg-black/20 text-black rounded-full" 
              onClick={() => store.clearRestTimer()}
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
