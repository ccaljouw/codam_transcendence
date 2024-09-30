import { PrismaClient } from '@prisma/client';

// // initialize Prisma Client
const prisma = new PrismaClient();

async function addDummyUsers() {
  //   // create dummy users
  const user0 = await prisma.user.upsert({
    where: { loginName: 'AI' },
    update: {},
    create: {
      userName: 'AwesomeBot',
      loginName: 'AI',
      email: 'aibot@student.codam.nl',
      firstName: 'AI',
      lastName: 'Bot',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { loginName: 'caljouw' },
    update: {},
    create: {
      userName: 'AwesomeBackendCreator',
      loginName: 'caljouw',
      email: 'caljouw@student.codam.nl',
      firstName: 'Carien',
      lastName: 'Caljouw',
    },
  });
  const auth1 = await prisma.auth.upsert({
    where: { userId: 1 },
    update: {},
    create: {
      userId: 1,
      pwd: '$2b$10$J.OTIHejy8gRLnIugPSNrOM3gNX9u0pY4MRwLfwbu2z/Igw/JvMO6',
    },
  });

  const stats1 = await prisma.stats.upsert({
    where: { userId: 1 },
    update: {},
    create: {
      userId: 1,
      ladderPosition: [1],
    },
  });

  const user2 = await prisma.user.upsert({
    where: { loginName: 'avanand' },
    update: {},
    create: {
      userName: 'AwesomeSocketCreator',
      loginName: 'avanand',
      email: 'avan_and@student.codam.nl',
      firstName: 'Albert',
      lastName: 'van Andel',
    },
  });

  const auth2 = await prisma.auth.upsert({
    where: { userId: 2 },
    update: {},
    create: {
      userId: 2,
      pwd: '$2b$10$J.OTIHejy8gRLnIugPSNrOM3gNX9u0pY4MRwLfwbu2z/Igw/JvMO6',
    },
  });

  const stats2 = await prisma.stats.upsert({
    where: { userId: 2 },
    update: {},
    create: {
      userId: 2,
      ladderPosition: [2],
    },
  });

  const user3 = await prisma.user.upsert({
    where: { loginName: 'jaberkro' },
    update: {},
    create: {
      userName: 'AwesomeFrontendCreator',
      loginName: 'jaberkro',
      email: 'jaberkro@student.codam.nl',
      firstName: 'Jorien',
      lastName: 'Aberkrom',
    },
  });

  const auth3 = await prisma.auth.upsert({
    where: { userId: 3 },
    update: {},
    create: {
      userId: 3,
      pwd: '$2b$10$J.OTIHejy8gRLnIugPSNrOM3gNX9u0pY4MRwLfwbu2z/Igw/JvMO6',
    },
  });

  const stats3 = await prisma.stats.upsert({
    where: { userId: 3 },
    update: {},
    create: {
      userId: 3,
      ladderPosition: [3],
    },
  });

  const user4 = await prisma.user.upsert({
    where: { loginName: 'cwesseli' },
    update: {},
    create: {
      userName: 'AwesomeGameCreator',
      loginName: 'cwesseli',
      email: 'cwesseli@student.codam.nl',
      firstName: 'Carlo',
      lastName: 'Wesseling',
    },
  });

  const auth4 = await prisma.auth.upsert({
    where: { userId: 4 },
    update: {},
    create: {
      userId: 4,
      pwd: '$2b$10$J.OTIHejy8gRLnIugPSNrOM3gNX9u0pY4MRwLfwbu2z/Igw/JvMO6',
    },
  });

  const stats4 = await prisma.stats.upsert({
    where: { userId: 4 },
    update: {},
    create: {
      userId: 4,
      ladderPosition: [4],
    },
  });

  const user5 = await prisma.user.upsert({
    where: { loginName: 'friendcarlo' },
    update: {},
    create: {
      userName: 'FriendFromCarlo',
      loginName: 'friendcarlo',
      email: 'carlofriend@student.codam.nl',
      firstName: 'Friend',
      lastName: 'Friendowitz',
    },
  });

  const auth5 = await prisma.auth.upsert({
    where: { userId: 5 },
    update: {},
    create: {
      userId: 5,
      pwd: '$2b$10$J.OTIHejy8gRLnIugPSNrOM3gNX9u0pY4MRwLfwbu2z/Igw/JvMO6',
    },
  });

  const stats5 = await prisma.stats.upsert({
    where: { userId: 5 },
    update: {},
    create: {
      userId: 5,
      ladderPosition: [5],
    },
  });

  const user6 = await prisma.user.upsert({
    where: { loginName: 'blockcarien' },
    update: {},
    create: {
      userName: 'BlockByCarien',
      loginName: 'blockcarien',
      email: 'blockcarien@student.codam.nl',
      firstName: 'Blocked',
      lastName: 'ByCarien',
    },
  });

  const auth6 = await prisma.auth.upsert({
    where: { userId: 6 },
    update: {},
    create: {
      userId: 6,
      pwd: '$2b$10$J.OTIHejy8gRLnIugPSNrOM3gNX9u0pY4MRwLfwbu2z/Igw/JvMO6',
    },
  });

  const stats6 = await prisma.stats.upsert({
    where: { userId: 6 },
    update: {},
    create: {
      userId: 6,
      ladderPosition: [6],
    },
  });

  // Establish friendship between users
  await prisma.user.update({
    where: { loginName: 'friendcarlo' },
    data: {
      friends: { connect: { loginName: 'cwesseli' } },
    },
  });

  await prisma.user.update({
    where: { loginName: 'cwesseli' },
    data: {
      friends: { connect: { loginName: 'friendcarlo' } },
    },
  });

  // Block user6 by user1
  await prisma.user.update({
    where: { loginName: 'caljouw' },
    data: {
      blocked: { connect: { loginName: 'blockcarien' } },
    },
  });
  console.log({
    user0,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    auth1,
    auth2,
    auth3,
    auth4,
    auth5,
    auth6,
    stats1,
    stats2,
    stats3,
    stats4,
    stats5,
    stats6,
  });
}

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