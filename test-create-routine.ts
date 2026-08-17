import { prisma } from './src/lib/db';
import { createRoutine } from './src/app/actions/routines';



async function main() {
  const data = {
    name: "Test Routine",
    description: "",
    exercises: [
      {
        exerciseId: "cm0000000000000000000000", // Needs a real exercise ID
        order: 0,
        sets: [
          {
            order: 0,
            setType: "NORMAL" as any,
            targetReps: "8-12",
            targetWeight: 10
          }
        ]
      }
    ]
  };
  
  try {
    const ex = await prisma.exercise.findFirst();
    if (ex) data.exercises[0]!.exerciseId = ex.id;
    const res = await createRoutine(data as any);
    console.log("Result:", res);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

main();
