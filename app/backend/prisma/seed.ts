import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

// create  dummy datarecords (records will only be added to the database if they do not exist yet (.upsert()))
async function main() {
  // create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'ccaljouw@student.codam.nl' },
    update: {},
    create: {
      email: 'ccaljouw@student.codam.nl',
      hash: 'pwd',
      firstName: 'Carien',
      lastName: 'Caljouw',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'avan_and@student.codam.nl' },
    update: {},
    create: {
      email: 'avan_and@student.codam.nl',
      hash: 'pwd',
      firstName: 'Albert',
      lastName: 'van Andel',
    },
  });
  const user3 = await prisma.user.upsert({
    where: { email: 'jaberkro@student.codam.nl' },
    update: {},
    create: {
      email: 'jaberkro@student.codam.nl',
      hash: 'pwd',
      firstName: 'Jorien',
      lastName: 'Aberkro',
    },
  });
  const user4 = await prisma.user.upsert({
    where: { email: 'cwesseli@student.codam.nl' },
    update: {},
    create: {
      email: 'cwesseli@student.codam.nl',
      hash: 'pwd',
      firstName: 'Carlo',
      lastName: 'Wesseling',
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
