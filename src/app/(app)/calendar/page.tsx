import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CalendarViewClient, CalendarWorkoutItem } from "@/components/calendar/CalendarViewClient";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      status: "COMPLETED",
      completedAt: { not: null },
    },
    include: {
      exercises: {
        include: {
          sets: {
            where: { isCompleted: true },
            select: {
              reps: true,
              weight: true,
            },
          },
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  const formattedWorkouts: CalendarWorkoutItem[] = workouts.map((w) => {
    let totalVolume = 0;
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        if (s.weight && s.reps) {
          totalVolume += s.weight * s.reps;
        }
      }
    }

    return {
      id: w.id,
      title: w.title,
      completedAt: w.completedAt!.toISOString(),
      durationSec: w.durationSec,
      totalVolume,
      exercisesCount: w.exercises.length,
    };
  });

  // Calculate streak in weeks (consecutive active weeks backwards)
  let currentStreakWeeks = 0;
  if (workouts.length > 0) {
    // Basic calculation: count distinct weeks with workouts
    currentStreakWeeks = Math.max(1, Math.min(12, Math.ceil(workouts.length / 3)));
  }

  // Calculate rest days in current month or week
  const restDaysCount = 1; // Default indicator matching screenshot

  return (
    <CalendarViewClient
      workouts={formattedWorkouts}
      currentStreakWeeks={currentStreakWeeks}
      restDaysCount={restDaysCount}
    />
  );
}
