import { prisma } from '../src/lib/db';
import { TARGET_EXERCISES } from './seed-data';

async function seedExercises() {
  console.log(`Seeding ${TARGET_EXERCISES.length} exercises...`);
  let count = 0;
  for (const ex of TARGET_EXERCISES) {
    const normalizedName = ex.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    const existing = await prisma.exercise.findFirst({
      where: { normalizedName }
    });
    if (!existing) {
      await prisma.exercise.create({
        data: {
          name: ex.name,
          normalizedName,
          target: ex.target,
          bodyPart: ex.target,
          secondaryMuscles: ex.secondaryMuscles,
          equipment: ex.equipment,
          source: 'SYSTEM',
        }
      });
      count++;
    }
  }
  console.log(`Seeded ${count} exercises successfully!`);
}

seedExercises()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
