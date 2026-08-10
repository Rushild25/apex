"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { finalizeWorkoutSchema } from "@/validations/workout";
import { z } from "zod";

export async function finalizeWorkout(data: z.infer<typeof finalizeWorkoutSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = finalizeWorkoutSchema.parse(data);
    const userId = session.user.id;

    // Only save completed sets
    const activeExercises = validated.exercises
      .map(ex => ({
        ...ex,
        sets: ex.sets.filter(s => s.isCompleted)
      }))
      .filter(ex => ex.sets.length > 0);

    if (activeExercises.length === 0) {
      throw new Error("No completed sets to save.");
    }

    const durationSec = Math.floor((validated.endTime - validated.startTime) / 1000);

    const workout = await prisma.$transaction(async (tx) => {
      const newWorkout = await tx.workout.create({
        data: {
          userId,
          routineId: validated.routineId,
          title: validated.title,
          notes: validated.notes,
          status: "COMPLETED",
          startedAt: new Date(validated.startTime),
          completedAt: new Date(validated.endTime),
          durationSec,
          exercises: {
            create: activeExercises.map((ex, exIdx) => ({
              exerciseId: ex.exerciseId,
              order: exIdx,
              exerciseSnapshot: {
                name: ex.name,
                bodyPart: ex.bodyPart,
                target: ex.target,
                equipment: ex.equipment,
                category: ex.category
              },
              sets: {
                create: ex.sets.map((set, setIdx) => ({
                  order: setIdx,
                  setType: set.setType,
                  reps: set.reps,
                  weight: set.weight,
                  isCompleted: true,
                  completedAt: new Date(validated.endTime),
                }))
              }
            }))
          }
        },
        include: {
          exercises: {
            include: {
              sets: true
            }
          }
        }
      });

      // Personal Record Evaluation
      for (const ex of newWorkout.exercises) {
        if (!ex.exerciseId) continue;

        let maxWeight = 0;
        let maxVolume = 0;
        let bestWeightSetId = null;
        let bestVolumeSetId = null;

        for (const set of ex.sets) {
          if (set.weight && set.reps) {
            if (set.weight > maxWeight) {
              maxWeight = set.weight;
              bestWeightSetId = set.id;
            }
            const volume = set.weight * set.reps;
            if (volume > maxVolume) {
              maxVolume = volume;
              bestVolumeSetId = set.id;
            }
          }
        }

        if (maxWeight > 0) {
          const existingWeightPR = await tx.personalRecord.findUnique({
            where: { userId_exerciseId_metric: { userId, exerciseId: ex.exerciseId, metric: 'WEIGHT_MAX' } }
          });
          if (!existingWeightPR || maxWeight > existingWeightPR.value) {
            await tx.personalRecord.upsert({
              where: { userId_exerciseId_metric: { userId, exerciseId: ex.exerciseId, metric: 'WEIGHT_MAX' } },
              update: { value: maxWeight, setId: bestWeightSetId, achievedAt: newWorkout.completedAt! },
              create: {
                userId,
                exerciseId: ex.exerciseId,
                exerciseName: (ex.exerciseSnapshot as { name?: string })?.name || "Unknown",
                metric: 'WEIGHT_MAX',
                value: maxWeight,
                setId: bestWeightSetId,
                achievedAt: newWorkout.completedAt!
              }
            });
          }
        }

        if (maxVolume > 0) {
          const existingVolumePR = await tx.personalRecord.findUnique({
            where: { userId_exerciseId_metric: { userId, exerciseId: ex.exerciseId, metric: 'VOLUME_MAX' } }
          });
          if (!existingVolumePR || maxVolume > existingVolumePR.value) {
            await tx.personalRecord.upsert({
              where: { userId_exerciseId_metric: { userId, exerciseId: ex.exerciseId, metric: 'VOLUME_MAX' } },
              update: { value: maxVolume, setId: bestVolumeSetId, achievedAt: newWorkout.completedAt! },
              create: {
                userId,
                exerciseId: ex.exerciseId,
                exerciseName: (ex.exerciseSnapshot as { name?: string })?.name || "Unknown",
                metric: 'VOLUME_MAX',
                value: maxVolume,
                setId: bestVolumeSetId,
                achievedAt: newWorkout.completedAt!
              }
            });
          }
        }
      }

      return newWorkout;
    });

    revalidatePath("/history");
    return { success: true, workoutId: workout.id };
  } catch (error: unknown) {
    console.error("Workout finalization error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to finalize workout");
  }
}

export async function getPreviousExerciseStats(exerciseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    // Find the most recent completed workout that includes this exercise
    const previousWorkoutExercise = await prisma.workoutExercise.findFirst({
      where: {
        exerciseId,
        workout: {
          userId: session.user.id,
          status: "COMPLETED",
        }
      },
      orderBy: {
        workout: {
          completedAt: 'desc'
        }
      },
      include: {
        sets: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!previousWorkoutExercise) return null;

    return previousWorkoutExercise.sets.map(s => ({
      weight: s.weight,
      reps: s.reps,
      setType: s.setType
    }));
  } catch (e) {
    console.error("Failed to fetch previous stats:", e);
    return null;
  }
}
