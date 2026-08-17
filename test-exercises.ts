import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const exercises = await prisma.exercise.findMany({ select: { name: true } });
  console.log(exercises.map(e => e.name));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
