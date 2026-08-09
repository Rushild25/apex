import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Dumbbell, Edit2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StartWorkoutButton } from "@/components/routines/StartWorkoutButton";
import { DeleteRoutineButton } from "@/components/routines/DeleteRoutineButton";
import { QuickStartButton } from "@/components/routines/QuickStartButton";

export const dynamic = "force-dynamic";

export default async function RoutinesPage() {
  const session = await auth();
  
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const routines = await prisma.routine.findMany({
    where: {
      userId: userId,
      isArchived: false,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routines</h1>
          <p className="text-muted-foreground">Manage your workout templates.</p>
        </div>
        <div className="flex gap-2">
          <QuickStartButton />
          <Link href="/routines/new" className={buttonVariants({ variant: "outline" })}>
            <Plus className="w-4 h-4 mr-2" />
            New Routine
          </Link>
        </div>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-card">
          <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No routines yet</h3>
          <p className="text-muted-foreground mb-4">Create your first workout routine to get started.</p>
          <Link href="/routines/new" className={cn(buttonVariants(), "mt-4")}>
            Create your first routine
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routines.map(routine => (
            <Card key={routine.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle>{routine.name}</CardTitle>
                {routine.description && (
                  <CardDescription className="line-clamp-2">{routine.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  {routine.exercises.slice(0, 3).map((re) => (
                    <div key={re.id} className="truncate">
                      {re.sets.length}x {re.exercise.name}
                    </div>
                  ))}
                  {routine.exercises.length > 3 && (
                    <div className="text-xs italic">+{routine.exercises.length - 3} more exercises</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <StartWorkoutButton routine={routine} />
                  <Link href={`/routines/${routine.id}/edit`} className={buttonVariants({ variant: "outline", size: "icon" })}>
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <DeleteRoutineButton routineId={routine.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
