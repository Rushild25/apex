import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  { name: "Bench Press (Barbell)", bodyPart: "Chest", target: "Pectorals", equipment: "Barbell", category: "Strength" },
  { name: "Incline Bench Press (Barbell)", bodyPart: "Chest", target: "Upper Pectorals", equipment: "Barbell", category: "Strength" },
  { name: "Squat (Barbell)", bodyPart: "Legs", target: "Quadriceps", equipment: "Barbell", category: "Strength" },
  { name: "Deadlift (Barbell)", bodyPart: "Back", target: "Glutes/Hamstrings", equipment: "Barbell", category: "Strength" },
  { name: "Overhead Press (Barbell)", bodyPart: "Shoulders", target: "Deltoids", equipment: "Barbell", category: "Strength" },
  { name: "Pull Up", bodyPart: "Back", target: "Lats", equipment: "Bodyweight", category: "Strength" },
  { name: "Lat Pulldown (Cable)", bodyPart: "Back", target: "Lats", equipment: "Cable", category: "Strength" },
  { name: "Barbell Row", bodyPart: "Back", target: "Rhomboids", equipment: "Barbell", category: "Strength" },
  { name: "Leg Press", bodyPart: "Legs", target: "Quadriceps", equipment: "Machine", category: "Strength" },
  { name: "Leg Extension", bodyPart: "Legs", target: "Quadriceps", equipment: "Machine", category: "Strength" },
  { name: "Leg Curl", bodyPart: "Legs", target: "Hamstrings", equipment: "Machine", category: "Strength" },
  { name: "Calf Raise", bodyPart: "Legs", target: "Calves", equipment: "Machine", category: "Strength" },
  { name: "Bicep Curl (Dumbbell)", bodyPart: "Arms", target: "Biceps", equipment: "Dumbbell", category: "Strength" },
  { name: "Tricep Extension (Cable)", bodyPart: "Arms", target: "Triceps", equipment: "Cable", category: "Strength" },
  { name: "Lateral Raise (Dumbbell)", bodyPart: "Shoulders", target: "Lateral Deltoid", equipment: "Dumbbell", category: "Strength" },
  { name: "Front Raise (Dumbbell)", bodyPart: "Shoulders", target: "Anterior Deltoid", equipment: "Dumbbell", category: "Strength" },
  { name: "Face Pull (Cable)", bodyPart: "Shoulders", target: "Rear Deltoid", equipment: "Cable", category: "Strength" },
  { name: "Crunch", bodyPart: "Core", target: "Abs", equipment: "Bodyweight", category: "Strength" },
  { name: "Plank", bodyPart: "Core", target: "Abs", equipment: "Bodyweight", category: "Strength" },
  { name: "Russian Twist", bodyPart: "Core", target: "Abs", equipment: "Bodyweight", category: "Strength" },
  { name: "Bench Press (Dumbbell)", bodyPart: "Chest", target: "Pectorals", equipment: "Dumbbell", category: "Strength" },
  { name: "Incline Bench Press (Dumbbell)", bodyPart: "Chest", target: "Upper Pectorals", equipment: "Dumbbell", category: "Strength" },
  { name: "Shoulder Press (Dumbbell)", bodyPart: "Shoulders", target: "Deltoids", equipment: "Dumbbell", category: "Strength" },
  { name: "Hammer Curl (Dumbbell)", bodyPart: "Arms", target: "Biceps", equipment: "Dumbbell", category: "Strength" },
  { name: "Tricep Pushdown (Cable)", bodyPart: "Arms", target: "Triceps", equipment: "Cable", category: "Strength" },
  { name: "Romanian Deadlift (Barbell)", bodyPart: "Legs", target: "Hamstrings", equipment: "Barbell", category: "Strength" },
  { name: "Bulgarian Split Squat", bodyPart: "Legs", target: "Quadriceps", equipment: "Dumbbell", category: "Strength" },
  { name: "Chest Fly (Cable)", bodyPart: "Chest", target: "Pectorals", equipment: "Cable", category: "Strength" },
  { name: "Pec Deck (Machine)", bodyPart: "Chest", target: "Pectorals", equipment: "Machine", category: "Strength" },
  { name: "Seated Row (Cable)", bodyPart: "Back", target: "Rhomboids", equipment: "Cable", category: "Strength" }
];

async function main() {
  console.log("Seeding exercises...");
  
  for (const ex of exercises) {
    const normalizedName = ex.name.toLowerCase();
    
    const existing = await prisma.exercise.findFirst({
      where: { name: ex.name, source: "SYSTEM" }
    });

    if (existing) {
      await prisma.exercise.update({
        where: { id: existing.id },
        data: {
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
          category: ex.category,
          normalizedName
        }
      });
    } else {
      await prisma.exercise.create({
        data: {
          name: ex.name,
          normalizedName,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
          category: ex.category,
          source: "SYSTEM",
        }
      });
    }
  }
  
  console.log(`Seeded ${exercises.length} exercises successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
