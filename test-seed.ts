import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 'mock-user-123' },
    update: {},
    create: {
      id: 'mock-user-123',
      email: 'mock@example.com',
      name: 'Mock User',
    },
  });
  console.log('Done');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
