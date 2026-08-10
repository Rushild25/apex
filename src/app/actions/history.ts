"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getWorkoutHistory(page = 1, limit = 10) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
            sets: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    const total = await prisma.workout.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
    });

    return {
      success: true,
      workouts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch workout history:", error);
    throw new Error("Failed to load workout history");
  }
}
