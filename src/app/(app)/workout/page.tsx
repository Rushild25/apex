import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, FileText, Search, ChevronDown, RefreshCw, MoreVertical } from "lucide-react";
import { QuickStartButton } from "@/components/routines/QuickStartButton";
import { StartWorkoutButton } from "@/components/routines/StartWorkoutButton";
import { DeleteRoutineButton } from "@/components/routines/DeleteRoutineButton";
import { RoutineFolderHeader } from "@/components/routines/RoutineFolderHeader";
import { Edit2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

export default async function WorkoutPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const routines = await prisma.routine.findMany({
    where: {
      userId,
      isArchived: false,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workout</h1>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5">
            <RefreshCw className="w-5 h-5" />
          </button>
          <span className="bg-amber-400/20 text-amber-400 text-xs font-black px-2 py-0.5 rounded-md tracking-wider">
            PRO
          </span>
        </div>
      </div>

      {/* Start Empty Workout Button */}
      <div className="w-full">
        <QuickStartButton />
      </div>

      {/* Routines Section Header */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Routines</h2>
          <RoutineFolderHeader />
        </div>

        {/* Action Buttons: New Routine & Explore */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/routines/new"
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-card border border-border/80 hover:bg-muted/60 transition-colors font-semibold text-sm shadow-sm"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>New Routine...</span>
          </Link>
          <Link
            href="/exercises"
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-card border border-border/80 hover:bg-muted/60 transition-colors font-semibold text-sm shadow-sm"
          >
            <Search className="w-4 h-4 text-primary" />
            <span>Explore</span>
          </Link>
        </div>
      </div>

      {/* Routines List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <ChevronDown className="w-4 h-4" />
          <span>My Routines ({routines.length})</span>
        </div>

        {routines.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-card/50 p-6">
            <p className="text-muted-foreground text-sm mb-4">You haven't created any routines yet.</p>
            <Link
              href="/routines/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" /> Create Routine
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => {
              const exerciseNames = routine.exercises.map((re) => re.exercise.name).join(", ");

              return (
                <div
                  key={routine.id}
                  className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-all shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-tight">{routine.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1 font-medium">
                        {exerciseNames || "No exercises configured"}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/routines/${routine.id}/edit`} className="flex items-center gap-2 cursor-pointer w-full">
                            <Edit2 className="w-4 h-4" /> Edit Routine
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <DeleteRoutineButton routineId={routine.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <StartWorkoutButton routine={routine} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
