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
  // create dummy bookmarks
  const bookmark1 = await prisma.bookmark.upsert({
    where: { title: 'First bookmark for user 1' },
    update: {
      ownerId: user1.id,
    },
    create: {
      title: 'First bookmark for user 1',
      link: 'http://localhost:3000',
      ownerId: user1.id,
    },
  });
  const bookmark2 = await prisma.bookmark.upsert({
    where: { title: 'Second bookmark for user 1' },
    update: {
      ownerId: user1.id,
    },
    create: {
      title: 'Second bookmark for user 1',
      link: 'http://localhost:3000/api',
      ownerId: user1.id,
    },
  });
  const bookmark3 = await prisma.bookmark.upsert({
    where: { title: 'First bookmark for user 2' },
    update: {
      ownerId: user1.id,
    },
    create: {
      title: 'First bookmark for user 2',
      link: 'http://localhost:3000/api',
      ownerId: user2.id,
    },
  });

  console.log({ user1, user2, bookmark1, bookmark2, bookmark3 });
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
