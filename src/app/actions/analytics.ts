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
    return {
      success: false,
      totalWorkouts: 0,
      totalVolume: 0,
      workoutsByDay: [],
    };
  }
}

export async function getMonthlyReportData(year: number, month: number) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const date = new Date(year, month - 1, 1);
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: monthStart, lte: monthEnd },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: { where: { isCompleted: true } },
          },
        },
      },
    });

    return { success: true, workouts };
  } catch (error: any) {
    console.error("Failed to fetch monthly report data:", error);
    return { success: false, error: error.message, workouts: [] };
  }
}

export async function getMuscleDistributionRadar(periodDays: number = 30) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const now = new Date();
    const startDate = subDays(now, periodDays);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: startDate },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: { where: { isCompleted: true } },
          },
        },
      },
    });

    const radar = { back: 0, chest: 0, core: 0, shoulders: 0, arms: 0, legs: 0 };
    for (const w of workouts) {
      for (const we of w.exercises) {
        const target = (we.exercise?.target || we.exercise?.bodyPart || "").toLowerCase();
        const setsCount = we.sets.length;
        if (target.includes("chest")) radar.chest += setsCount;
        else if (target.includes("back") || target.includes("lat")) radar.back += setsCount;
        else if (target.includes("shoulder") || target.includes("delt")) radar.shoulders += setsCount;
        else if (target.includes("bicep") || target.includes("tricep") || target.includes("arm")) radar.arms += setsCount;
        else if (target.includes("quad") || target.includes("hamstring") || target.includes("glute") || target.includes("leg") || target.includes("calf")) radar.legs += setsCount;
        else if (target.includes("abdom") || target.includes("core")) radar.core += setsCount;
      }
    }

    return { success: true, radar, workoutsCount: workouts.length };
  } catch (error: any) {
    console.error("Failed to fetch muscle distribution radar:", error);
    return {
      success: false,
      error: error.message,
      radar: { back: 0, chest: 0, core: 0, shoulders: 0, arms: 0, legs: 0 },
      workoutsCount: 0,
    };
  }
}

export async function getWeeklyBodyHeatmap(weekStartDate: Date) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const weekEnd = new Date(weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: weekStartDate, lte: weekEnd },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: { where: { isCompleted: true } },
          },
        },
      },
    });

    const muscleSets: Record<string, number> = {};
    for (const w of workouts) {
      for (const we of w.exercises) {
        const target = we.exercise?.target || we.exercise?.bodyPart || "Other";
        const count = we.sets.length;
        muscleSets[target] = (muscleSets[target] || 0) + count;
      }
    }

    return { success: true, muscleSets };
  } catch (error: any) {
    console.error("Failed to fetch weekly body heatmap:", error);
    return { success: false, error: error.message, muscleSets: {} };
  }
}
