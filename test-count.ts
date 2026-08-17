import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.exercise.count();
  console.log('Exercise count:', count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
