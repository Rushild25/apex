import { z } from "zod";

export const workoutSetSchema = z.object({
  setType: z.enum(["NORMAL", "WARMUP", "DROPSET", "FAILURE"]),
  reps: z.number().nullable(),
  weight: z.number().nullable(),
  isCompleted: z.boolean(),
  order: z.number(),
});

export const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  name: z.string(),
  bodyPart: z.string().nullable(),
  target: z.string().nullable(),
  equipment: z.string().nullable(),
  category: z.string().nullable(),
  order: z.number(),
  sets: z.array(workoutSetSchema),
});

export const finalizeWorkoutSchema = z.object({
  routineId: z.string().nullable(),
  title: z.string().min(1, "Workout title is required"),
  notes: z.string().optional(),
  startTime: z.number(),
  endTime: z.number(),
  exercises: z.array(workoutExerciseSchema),
});

export type FinalizeWorkoutInput = z.infer<typeof finalizeWorkoutSchema>;
