import { PrismaClient } from '@prisma/client';

// // initialize Prisma Client
const prisma = new PrismaClient();

async function addDummyUsers() {
	//   // create dummy users
	const user1 = await prisma.user.upsert({
		where: { loginName: 'Carien' },
		update: {},
		create: {
			userName: 'AwesomeBackendCreator',
			loginName: 'ccaljouw',
			email: 'ccaljouw@student.codam.nl',
			hash: 'pwd',
			firstName: 'Carien',
			lastName: 'Caljouw',
		},
	});
  const stats1 = await prisma.stats.upsert({
		where: { userId: 1 },
    update: {},
		create: {
			userId: 1,
		},
	});

	const user2 = await prisma.user.upsert({
		where: { loginName: 'Albert' },
		update: {},
		create: {
			userName: 'AwesomeSocketCreator',
			loginName: 'avan-and',
			email: 'avan_and@student.codam.nl',
			hash: 'pwd',
			firstName: 'Albert',
			lastName: 'van Andel',
		},
	});

  const stats2 = await prisma.stats.upsert({
		where: { userId: 2 },
    update: {},
		create: {
			userId: 2,
		},
	});

	const user3 = await prisma.user.upsert({
		where: { loginName: 'Jorien' },
		update: {},
		create: {
			userName: 'AwesomeFrontendCreator',
			loginName: 'jaberkro',
			email: 'jaberkro@student.codam.nl',
			hash: 'pwd',
			firstName: 'Jorien',
			lastName: 'Aberkrom',
		},
	});

  const stats3 = await prisma.stats.upsert({
		where: { userId: 3 },
    update: {},
		create: {
			userId: 3,
		},
	});

	const user4 = await prisma.user.upsert({
		where: { loginName: 'Carlo' },
		update: {},
		create: {
			userName: 'AwesomeGameCreator',
			loginName: 'cwesseli',
			email: 'cwesseli@student.codam.nl',
			hash: 'pwd',
			firstName: 'Carlo',
			lastName: 'Wesseling',
		},
	});
  const stats4 = await prisma.stats.upsert({
		where: { userId: 4 },
    update: {},
		create: {
			userId: 4,
		},
	});

	const user5 = await prisma.user.upsert({
		where: { loginName: 'Friend' },
		update: {},
		create: {
			userName: 'FriendFromCarlo',
			loginName: 'friendcarlo',
			email: 'carlofriend@student.codam.nl',
			hash: 'pwd',
			firstName: 'Friend',
			lastName: 'Friendowitz',
		},
	});
  const stats5 = await prisma.stats.upsert({
		where: { userId: 5 },
    update: {},
		create: {
			userId: 5,
		},
	});

	const user6 = await prisma.user.upsert({
		where: { loginName: 'BlockedByCarien' },
		update: {},
		create: {
			userName: 'BlockByCarien',
			loginName: 'blockcarien',
			email: 'blockcarien@student.codam.nl',
			hash: 'pwd',
			firstName: 'Blocked',
			lastName: 'ByCarien',
		},
	});

	// Establish friendship between users
	await prisma.user.update({
		where: { loginName: 'friendcarlo' },
		data: {
			friends: { connect: { loginName: 'cwesseli' } }
		}

	});

	await prisma.user.update({
		where: { loginName: 'cwesseli' },
		data: {
			friends: { connect: { loginName: 'friendcarlo' } }
		}
	});

	// Block user6 by user1
	await prisma.user.update({
		where: { loginName: 'ccaljouw' },
		data: {
			blocked: { connect: { loginName: 'blockcarien' } }
		}
	});
	console.log({ user1, user2, user3, user4, user5, user6 });
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
