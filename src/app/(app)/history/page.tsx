import { getWorkoutHistory } from "@/app/actions/history";
import { WorkoutHistoryCard } from "@/components/history/WorkoutHistoryCard";
import { History } from "lucide-react";

export const metadata = {
  title: "History | Workout Tracker",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { workouts } = await getWorkoutHistory(1, 20);

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <History className="w-6 h-6" />
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No workouts recorded yet.</p>
          <p className="text-sm mt-2">Start a workout to see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutHistoryCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}
