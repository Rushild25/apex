"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createRoutineSchema } from "@/validations/routine";

export async function createRoutine(data: z.infer<typeof createRoutineSchema>) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const validated = createRoutineSchema.parse(data);

    const payload = {
      userId: userId,
      name: validated.name,
      description: validated.description,
      exercises: {
        create: validated.exercises.map((ex) => ({
          exercise: { connect: { id: ex.exerciseId } },
          order: ex.order,
          restSeconds: ex.restSeconds || null,
          notes: ex.notes || null,
          sets: {
            create: ex.sets.map((set) => ({
              order: set.order,
              setType: set.setType,
              targetReps: set.targetReps || null,
              targetWeight: set.targetWeight,
            })),
          },
        })),
      },
    };

    const routine = await prisma.routine.create({
      data: payload
    });

    revalidatePath("/workout");
    revalidatePath("/routines");
    return { success: true, routineId: routine.id };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || String(error) };
  }
}

export async function deleteRoutine(id: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const routine = await prisma.routine.findUnique({ where: { id } });
    if (routine?.userId !== userId) throw new Error("Unauthorized");

    await prisma.routine.delete({ where: { id } });
    revalidatePath("/workout");
    revalidatePath("/routines");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || String(error) };
  }
}

export async function updateRoutine(id: string, data: z.infer<typeof createRoutineSchema>) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const validated = createRoutineSchema.parse(data);

    const existing = await prisma.routine.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) throw new Error("Unauthorized");

    await prisma.$transaction([
      prisma.routineExercise.deleteMany({ where: { routineId: id } }),
      prisma.routine.update({
        where: { id },
        data: {
          name: validated.name,
          description: validated.description,
          exercises: {
            create: validated.exercises.map((ex) => ({
              exercise: { connect: { id: ex.exerciseId } },
              order: ex.order,
              restSeconds: ex.restSeconds || null,
              notes: ex.notes || null,
              sets: {
                create: ex.sets.map((set) => ({
                  order: set.order,
                  setType: set.setType,
                  targetReps: set.targetReps || null,
                  targetWeight: set.targetWeight,
                })),
              },
            })),
          },
        },
      })
    ]);

    revalidatePath("/workout");
    revalidatePath("/routines");
    return { success: true, routineId: id };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || String(error) };
  }
}
