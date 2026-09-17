import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Search, Bell, Dumbbell, Plus } from "lucide-react";
import Link from "next/link";
import { WorkoutFeedCard, FeedWorkout } from "@/components/feed/WorkoutFeedCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch completed workouts for the feed
  const workouts = await prisma.workout.findMany({
    where: {
      status: "COMPLETED",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      exercises: {
        include: {
          exercise: {
            select: {
              name: true,
              target: true,
              gifUrl: true,
            },
          },
          sets: {
            where: { isCompleted: true },
            select: {
              reps: true,
              weight: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { completedAt: "desc" },
    take: 25,
  });

  // Fetch PR counts achieved by users
  const prs = await prisma.personalRecord.findMany({
    where: {
      userId,
    },
    select: {
      exerciseName: true,
      achievedAt: true,
    },
  });

  // Calculate workout number sequence per user
  const userWorkoutCounts = await prisma.workout.groupBy({
    by: ["userId"],
    where: { status: "COMPLETED" },
    _count: { id: true },
  });
  const countMap = new Map(userWorkoutCounts.map((item) => [item.userId, item._count.id]));

  const feedWorkouts: FeedWorkout[] = workouts.map((w, index) => {
    // Total volume calculation
    let totalVolume = 0;
    const exercisesSummary = w.exercises.map((we) => {
      const completedSets = we.sets.filter((s) => s.weight && s.reps);
      for (const s of completedSets) {
        totalVolume += (s.weight || 0) * (s.reps || 0);
      }

      return {
        id: we.id,
        exerciseName: we.exercise?.name || (we.exerciseSnapshot as any)?.name || "Exercise",
        setsCount: we.sets.length,
        target: we.exercise?.target,
        gifUrl: we.exercise?.gifUrl,
      };
    });

    // Approximate PR count achieved on that workout date
    const workoutDate = w.completedAt ? new Date(w.completedAt).toDateString() : null;
    const prCount = workoutDate
      ? prs.filter((p) => new Date(p.achievedAt).toDateString() === workoutDate).length
      : 0;

    return {
      id: w.id,
      title: w.title,
      completedAt: w.completedAt,
      startedAt: w.startedAt,
      durationSec: w.durationSec,
      user: {
        id: w.user.id,
        name: w.user.name,
        image: w.user.image,
      },
      workoutNumber: countMap.get(w.user.id) ? (countMap.get(w.user.id)! - index > 0 ? countMap.get(w.user.id)! - index : undefined) : undefined,
      prCount,
      totalVolume,
      exercises: exercisesSummary,
    };
  });

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Home</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/exercises"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Feed List */}
      {feedWorkouts.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-border/80 rounded-2xl bg-card space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No workouts logged yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Start your training journey by completing your first workout or routine!
            </p>
          </div>
          <Link
            href="/workout"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            Start Workout
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {feedWorkouts.map((workout) => (
            <WorkoutFeedCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}
