import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.exercise.count();
  console.log(`Total exercises in DB: ${count}`);
  
  if (count > 0) {
    const exs = await prisma.exercise.findMany({ take: 5 });
    console.log(exs.map(e => e.name));
  }
}

main().finally(() => prisma.$disconnect());
