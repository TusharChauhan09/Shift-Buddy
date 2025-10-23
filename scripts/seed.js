const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create a test user for credentials login
  const passwordHash = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { registrationNumber: 'TEST001' },
    update: {},
    create: {
      registrationNumber: 'TEST001',
      name: 'Test User',
      email: 'test@example.com',
      passwordHash,
    },
  });

  console.log('Created test user:', { id: user.id, registrationNumber: user.registrationNumber, name: user.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });