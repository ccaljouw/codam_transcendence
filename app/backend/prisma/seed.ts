import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

// create two dummy datarecords
async function main() {
  // create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'ccaljouw@student.codam.nl' },
    update: {},
    create: {
      email: 'ccaljouw@student.codam.nl',
      hash: 'this is my pwd',
      firstName: 'Carien',
      lastName: 'Caljouw',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'aap@student.codam.nl' },
    update: {},
    create: {
      email: 'aap@student.codam.nl',
      hash: 'this is my pwd',
      firstName: 'Aap',
      lastName: 'Je',
    },
  });

  console.log({ user1, user2 });
}

// execute
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
