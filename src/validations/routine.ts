import { z } from "zod";

export const routineSetSchema = z.object({
  order: z.number(),
  setType: z.enum(["NORMAL", "WARMUP", "DROPSET", "FAILURE"]).default("NORMAL"),
  targetReps: z.string().optional().nullable(),
  targetWeight: z.number().optional().nullable(),
});

export const routineExerciseSchema = z.object({
  id: z.string().optional(), // Used by react-hook-form / UI
  exerciseId: z.string(),
  order: z.number(),
  restSeconds: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  sets: z.array(routineSetSchema),
});

export const createRoutineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  description: z.string().optional().nullable(),
  exercises: z.array(routineExerciseSchema).default([]),
});

export type RoutineSetInput = z.infer<typeof routineSetSchema>;
export type RoutineExerciseInput = z.infer<typeof routineExerciseSchema>;
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
