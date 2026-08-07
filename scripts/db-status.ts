import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const exerciseCount = await prisma.exercise.count();
  const routineCount = await prisma.routine.count();
  const workoutCount = await prisma.workout.count();

  console.log('--- Database Status ---');
  console.log(`Users: ${userCount}`);
  console.log(`Exercises: ${exerciseCount}`);
  console.log(`Routines: ${routineCount}`);
  console.log(`Workouts: ${workoutCount}`);

  if (routineCount > 0) {
    const r = await prisma.routine.findFirst({
      include: {
        exercises: {
          include: { sets: true }
        }
      }
    });
    console.log('\nSample Routine:');
    console.log(JSON.stringify(r, null, 2));
  }

  if (workoutCount > 0) {
    const w = await prisma.workout.findFirst({
      include: {
        exercises: {
          include: { sets: true }
        }
      }
    });
    console.log('\nSample Workout:');
    console.log(JSON.stringify(w, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
