import { prisma } from './src/lib/db';

async function testPrismaCreate() {
  const payload = {
    userId: "mock-user-123",
    name: "jhn",
    description: "",
    exercises: {
      create: [
        {
          exercise: { connect: { id: "cmsz3ahxu00ej58ug5rbm6gst" } },
          order: 0,
          restSeconds: null,
          notes: null,
          sets: {
            create: [
              {
                order: 0,
                setType: "NORMAL" as any,
                targetReps: "9",
                targetWeight: null
              }
            ]
          }
        }
      ]
    }
  };

  try {
    const ex = await prisma.exercise.findFirst();
    if (ex) {
        payload.exercises.create[0]!.exercise.connect.id = ex.id;
    }
    console.log("Attempting to insert:", JSON.stringify(payload, null, 2));
    const routine = await prisma.routine.create({
      data: payload as any
    });
    console.log("Success:", routine);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaCreate();
