import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { RoutineBuilder } from "@/components/routines/RoutineBuilder";

export default async function EditRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const routine = await prisma.routine.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!routine || routine.userId !== session.user.id || routine.isArchived) {
    notFound();
  }

  const initialData = {
    id: routine.id,
    name: routine.name,
    description: routine.description || "",
    exercises: routine.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      order: ex.order,
      restSeconds: ex.restSeconds,
      notes: ex.notes || "",
      sets: ex.sets.map((set) => ({
        order: set.order,
        setType: set.setType as "NORMAL" | "WARMUP" | "DROPSET" | "FAILURE",
        targetReps: set.targetReps ? String(set.targetReps) : null,
        targetWeight: set.targetWeight,
      })),
    })),
  };

  const initialExerciseNames: Record<string, string> = {};
  routine.exercises.forEach((ex) => {
    initialExerciseNames[ex.exerciseId] = ex.exercise.name;
  });

  return (
    <RoutineBuilder
      mode="edit"
      routineId={routine.id}
      initialData={initialData}
      initialExerciseNames={initialExerciseNames}
    />
  );
}
