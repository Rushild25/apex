import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BodyDistributionClient, SerializedWorkout } from "@/components/statistics/BodyDistributionClient";

export const dynamic = "force-dynamic";

export default async function BodyDistributionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  let workoutsDb: any[] = [];
  try {
    workoutsDb = await prisma.workout.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: { where: { isCompleted: true } },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });
  } catch (err) {
    console.warn("Could not fetch workouts from DB:", err);
  }

  const serializedWorkouts: SerializedWorkout[] = workoutsDb
    .filter((w) => !!w.completedAt)
    .map((w) => ({
      id: w.id,
      completedAt: new Date(w.completedAt).toISOString(),
      exercises: w.exercises.map((we: any) => ({
        name: we.exercise?.name || (we.exerciseSnapshot as any)?.name || "Exercise",
        target: we.exercise?.target || we.exercise?.bodyPart || (we.exerciseSnapshot as any)?.target || null,
        bodyPart: we.exercise?.bodyPart || (we.exerciseSnapshot as any)?.bodyPart || null,
        setsCount: we.sets.length,
      })),
    }));

  return <BodyDistributionClient workouts={serializedWorkouts} />;
}

