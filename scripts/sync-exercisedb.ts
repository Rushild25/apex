import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting ExerciseDB sync...");
  let cursor: string | null = null;
  let totalSynced = 0;
  
  // Clean up the previously hardcoded exercises first
  await prisma.exercise.deleteMany({
    where: { source: "SYSTEM" }
  });
  console.log("Cleared existing system exercises.");

  const url = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`;
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  const exercisesToCreate = data.map((ex: any) => ({
    externalId: ex.id || ex.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    name: ex.name,
    normalizedName: ex.name.toLowerCase(),
    bodyPart: ex.primaryMuscles?.[0] || null,
    target: ex.primaryMuscles?.[0] || null,
    secondaryMuscles: ex.secondaryMuscles || [],
    equipment: ex.equipment || null,
    gifUrl: null, // yuhonas has 'images' instead of gifs, we can skip or add images
    instructions: ex.instructions || [],
    source: "SYSTEM" as const,
    lastSyncedAt: new Date(),
  }));
  
  await prisma.exercise.createMany({
    data: exercisesToCreate,
    skipDuplicates: true,
  });
  
  console.log(`Successfully synced ${exercisesToCreate.length} exercises from ExerciseDB dump.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
