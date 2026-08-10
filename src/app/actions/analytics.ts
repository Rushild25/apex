"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { subDays } from "date-fns";

export async function getDashboardAnalytics() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const thirtyDaysAgo = subDays(new Date(), 30);

    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        startedAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
      orderBy: {
        startedAt: "asc",
      },
    });

    let totalVolume = 0;
    const workoutsByDay: Record<string, number> = {};

    workouts.forEach((workout) => {
      const dateKey = workout.startedAt?.toISOString().split("T")[0];
      if (!dateKey) return;
      
      workoutsByDay[dateKey] = (workoutsByDay[dateKey] || 0) + 1;

      workout.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          if (set.isCompleted && set.weight && set.reps && set.setType === "NORMAL") {
            totalVolume += set.weight * set.reps;
          }
        });
      });
    });

    return {
      success: true,
      totalWorkouts: workouts.length,
      totalVolume,
      workoutsByDay: Object.entries(workoutsByDay).map(([date, count]) => ({
        date,
        count,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    throw new Error("Failed to load analytics");
  }
}
