import { PrismaClient } from '@prisma/client';

// // initialize Prisma Client
const prisma = new PrismaClient();

async function addDummyUsers() {
  //   // create dummy users
  const user1 = await prisma.user.upsert({
    where: { loginName: 'ccaljouw' },
    update: {},
    create: {
      loginName: 'ccaljouw',
      email: 'ccaljouw@student.codam.nl',
      hash: 'this is my pwd',
      firstName: 'Carien',
      lastName: 'Caljouw',
      online: 1
    },
  });
  const user2 = await prisma.user.upsert({
    where: { loginName: 'aap' },
    update: {},
    create: {
      loginName: 'aap',
      email: 'aap@student.codam.nl',
      hash: 'this is my pwd',
      firstName: 'Aap',
      lastName: 'Je',
      online: 1
    },
  });
  console.log({ user1, user2 });
}

// todo: add userState to dummy data

async function main() {
  addDummyUsers();
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
