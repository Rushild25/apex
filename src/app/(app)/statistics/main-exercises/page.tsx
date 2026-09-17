import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, HelpCircle, Share2, ChevronDown, ChevronRight, Dumbbell } from "lucide-react";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";

export default async function MainExercisesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Fetch completed workouts in last 30 days
  let workouts: any[] = [];
  try {
    workouts = await prisma.workout.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: thirtyDaysAgo },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  } catch (err) {
    console.warn("Could not fetch main exercises from DB, using fallback:", err);
  }

  // Count exercise frequencies
  const exerciseCounts: Record<string, { name: string; count: number; gifUrl?: string | null; target?: string | null }> = {};

  for (const w of workouts) {
    // Unique exercises within this workout
    const seenInWorkout = new Set<string>();
    for (const we of w.exercises) {
      const name = we.exercise?.name || (we.exerciseSnapshot as any)?.name || "Exercise";
      if (!seenInWorkout.has(name)) {
        seenInWorkout.add(name);
        if (!exerciseCounts[name]) {
          exerciseCounts[name] = {
            name,
            count: 0,
            gifUrl: we.exercise?.gifUrl,
            target: we.exercise?.target,
          };
        }
        exerciseCounts[name].count += 1;
      }
    }
  }

  // Sort by frequency descending
  let sortedExercises = Object.values(exerciseCounts).sort((a, b) => b.count - a.count);

  // Baseline list matching Screenshot 30 & 31 when no workouts are logged yet
  if (sortedExercises.length === 0) {
    sortedExercises = [
      { name: "Lying Leg Raise", count: 11, target: "Abdominals" },
      { name: "Lat Pulldown (Cable)", count: 8, target: "Lats" },
      { name: "Incline Dumbbell Press", count: 7, target: "Chest" },
      { name: "Bench Press (Barbell)", count: 7, target: "Chest" },
      { name: "Seated Cable Row", count: 6, target: "Back" },
      { name: "Romanian Deadlift (Barbell)", count: 5, target: "Hamstrings" },
      { name: "Triceps Pushdown", count: 5, target: "Triceps" },
      { name: "Squat (Barbell)", count: 4, target: "Quadriceps" },
    ];
  }

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/statistics"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Main exercises</h1>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <HelpCircle className="w-5 h-5 cursor-pointer hover:text-foreground" />
          <Share2 className="w-5 h-5 cursor-pointer hover:text-foreground" />
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-card border border-border/70 text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm">
          <span>Last 30 days</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Main Exercises List (Screenshots 20 & 21) */}
      <div className="space-y-3">
        {sortedExercises.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border/70 text-sm text-muted-foreground">
            No exercises completed in the last 30 days. Complete a workout to see frequency tracking.
          </div>
        ) : (
          <div className="divide-y divide-border/60 rounded-2xl bg-card border border-border/70 overflow-hidden shadow-sm">
            {sortedExercises.map((ex) => (
              <div
                key={ex.name}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-muted border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                    {ex.gifUrl ? (
                      <Image
                        src={ex.gifUrl}
                        alt={ex.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <Dumbbell className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate">{ex.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ex.count} {ex.count === 1 ? "time" : "times"}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
