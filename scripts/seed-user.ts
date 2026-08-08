import { prisma } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function seedMockUser() {
  const email = 'mock@example.com';
  const password = 'password123';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword
    },
    create: {
      email,
      name: 'Mock User',
      password: hashedPassword,
      profile: {
        create: {
          weightUnit: 'KG',
          distanceUnit: 'KM'
        }
      }
    }
  });
  
  console.log(`Mock user seeded: ${user.email} / ${password}`);
}

seedMockUser()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
