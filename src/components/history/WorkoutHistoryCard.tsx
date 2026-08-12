import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Dumbbell } from "lucide-react";
import type { Prisma } from "@prisma/client";

type WorkoutWithRelations = Prisma.WorkoutGetPayload<{
  include: {
    exercises: {
      include: {
        exercise: {
          select: { name: true };
        };
        sets: true;
      };
    };
  };
}>;

interface WorkoutHistoryCardProps {
  workout: WorkoutWithRelations;
}

export function WorkoutHistoryCard({ workout }: WorkoutHistoryCardProps) {
  // Calculate total volume (weight * reps) across all completed normal sets
  let totalVolume = 0;
  let totalSets = 0;

  workout.exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      if (set.isCompleted && set.setType === "NORMAL") {
        totalSets++;
        if (set.reps && set.weight) {
          totalVolume += set.reps * set.weight;
        }
      }
    });
  });

  const durationMin = workout.durationSec ? Math.round(workout.durationSec / 60) : 0;

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{workout.title}</CardTitle>
            <CardDescription>
              {format(new Date(workout.startedAt), "PPP 'at' p")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {durationMin} min
          </div>
          <div className="flex items-center">
            <Dumbbell className="w-4 h-4 mr-1" />
            {totalVolume > 0 ? `${totalVolume} kg` : `${totalSets} sets`}
          </div>
        </div>

        <div className="space-y-2">
          {workout.exercises.map((ex) => {
            const bestSet = [...ex.sets]
              .filter((s) => s.isCompleted && s.weight && s.reps)
              .sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];

            return (
              <div key={ex.id} className="text-sm flex justify-between">
                <span className="font-medium truncate pr-2">
                  {ex.sets.filter((s) => s.isCompleted).length} x {ex.exercise?.name || "Custom Exercise"}
                </span>
                <span className="text-muted-foreground whitespace-nowrap">
                  {bestSet ? `${bestSet.weight}kg x ${bestSet.reps}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
