import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const ex = await prisma.exercise.findFirst({ where: { name: { contains: 'pull up' } } });
    if (!ex) throw new Error("Exercise not found");
    
    console.log("Found exercise:", ex.id);

    const routine = await prisma.routine.create({
      data: {
        userId: 'mock-user-123',
        name: 'Back Day',
        description: null,
        exercises: {
          create: [
            {
              exercise: { connect: { id: ex.id } },
              order: 0,
              restSeconds: null,
              notes: null,
              sets: {
                create: [
                  {
                    order: 0,
                    setType: "NORMAL",
                    targetReps: null,
                    targetWeight: null,
                  }
                ]
              }
            }
          ]
        }
      }
    });
    console.log("Success!", routine.id);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

main().finally(() => prisma.$disconnect());
