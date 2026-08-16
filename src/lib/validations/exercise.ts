import { z } from "zod";

// Schema for the incoming data from ExerciseDB V1 API
export const exerciseDbItemSchema = z.object({
  bodyPart: z.string(),
  equipment: z.string(),
  gifUrl: z.string().url(),
  id: z.string(),
  name: z.string(),
  target: z.string(),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string()),
});

export type ExerciseDbItem = z.infer<typeof exerciseDbItemSchema>;

export const syncExercisesRequestSchema = z.object({
  secret: z.string(), // Simple protection for the admin route
});
