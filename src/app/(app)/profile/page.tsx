import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileDashboardClient } from "@/components/profile/ProfileDashboardClient";
import { FeedWorkout } from "@/components/feed/WorkoutFeedCard";
import { startOfWeek, subWeeks, format, addDays } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Count workouts
  const workoutCount = await prisma.workout.count({
    where: {
      userId,
      status: "COMPLETED",
    },
  });

  // Fetch personal records
  const prs = await prisma.personalRecord.findMany({
    where: { userId },
    select: {
      id: true,
      achievedAt: true,
    },
  });

  // Fetch all completed workouts for this user
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    include: {
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
  });

  // Format workouts for feed
  const feedWorkouts: FeedWorkout[] = workouts.map((w, index) => {
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
        id: user.id,
        name: user.name,
        image: user.image,
      },
      workoutNumber: workoutCount - index,
      prCount,
      totalVolume,
      exercises: exercisesSummary,
    };
  });

  // Generate last 10 weekly buckets
  const now = new Date();
  const weeklyData = [];

  for (let i = 9; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 7);

    const weekWorkouts = workouts.filter((w) => {
      if (!w.completedAt) return false;
      const d = new Date(w.completedAt);
      return d >= weekStart && d < weekEnd;
    });

    let reps = 0;
    let volumeKg = 0;
    let durationHours = 0;

    for (const w of weekWorkouts) {
      if (w.durationSec) {
        durationHours += w.durationSec / 3600;
      }
      for (const we of w.exercises) {
        for (const s of we.sets) {
          if (s.reps) {
            reps += s.reps;
          }
          if (s.weight && s.reps) {
            volumeKg += s.weight * s.reps;
          }
        }
      }
    }

    weeklyData.push({
      label: format(weekStart, "MMM d"),
      reps,
      volumeKg,
      durationHours: Math.round(durationHours * 10) / 10,
    });
  }

  return (
    <ProfileDashboardClient
      user={user}
      workoutCount={workoutCount}
      followersCount={0}
      followingCount={0}
      weeklyData={weeklyData}
      workouts={feedWorkouts}
    />
  );
}
