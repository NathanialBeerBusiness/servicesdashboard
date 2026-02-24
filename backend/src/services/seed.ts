import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const accounts = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.account.create({
        data: {
          name: `Customer ${i + 1}`,
          company: `Company ${i + 1}`,
          phone: `04000000${i}`,
          email: `customer${i + 1}@example.com`,
          address: `${i + 1} Demo Street`,
          notes: 'Seeded account'
        }
      })
    )
  );

  for (let i = 0; i < 10; i++) {
    await prisma.job.create({
      data: {
        jobCode: `JOB-${1000 + i}`,
        accountId: accounts[i % accounts.length].id,
        description: `Inspection job ${i + 1}`,
        assignedStaff: 'Tech Team',
        location: `${i + 1} Demo Street`,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000 * (i + 1)),
        priority: i % 3 === 0 ? 'HIGH' : 'MEDIUM'
      }
    });
  }

  console.log('Seed complete');
}

run().finally(() => prisma.$disconnect());
