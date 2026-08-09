import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const userId = session.user.id;

  // 1. Workouts Completed
  const workoutsCompleted = await prisma.workout.count({
    where: {
      userId,
      status: "COMPLETED",
    },
  });

  // 2. Total Volume
  // We sum weight * reps across all completed sets in completed workouts.
  const allSets = await prisma.workoutSet.findMany({
    where: {
      isCompleted: true,
      workoutExercise: {
        workout: {
          userId,
          status: "COMPLETED",
        },
      },
      weight: { not: null },
      reps: { not: null },
    },
    select: {
      weight: true,
      reps: true,
    },
  });

  const totalVolume = allSets.reduce((acc, set) => acc + (set.weight || 0) * (set.reps || 0), 0);
  
  // Format volume (add commas)
  const formattedVolume = new Intl.NumberFormat("en-US").format(totalVolume);

  // 3. Active Streak (simple calculation: count distinct consecutive days backwards from today)
  // Or just basic representation for now
  const workouts = await prisma.workout.findMany({
    where: { userId, status: "COMPLETED", completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true }
  });
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  
  const dates = [...new Set(workouts.map(w => {
    const d = new Date(w.completedAt!);
    d.setHours(0,0,0,0);
    return d.getTime();
  }))];
  
  for (const time of dates) {
    const diffDays = Math.floor((currentDate.getTime() - time) / (1000 * 3600 * 24));
    if (diffDays === 0 || diffDays === 1) { // Same day or previous day
      streak++;
      currentDate = new Date(time);
    } else {
      break;
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold leading-none tracking-tight mb-2">Workouts Completed</h3>
          <p className="text-3xl font-bold">{workoutsCompleted}</p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold leading-none tracking-tight mb-2">Total Volume</h3>
          <p className="text-3xl font-bold">{formattedVolume} kg</p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold leading-none tracking-tight mb-2">Active Streak</h3>
          <p className="text-3xl font-bold">{streak} days</p>
        </div>
      </div>
    </div>
  );
}
