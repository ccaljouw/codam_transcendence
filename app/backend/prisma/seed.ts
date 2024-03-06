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
			loginName: 'Carien',
			email: 'ccaljouw@student.codam.nl',
			hash: 'pwd',
			firstName: 'Carien',
			lastName: 'Caljouw',
		},
	});
	const user2 = await prisma.user.upsert({
		where: { loginName: 'Albert' },
		update: {},
		create: {
			userName: 'AwesomeSocketCreator',
			loginName: 'Albert',
			email: 'avan_and@student.codam.nl',
			hash: 'pwd',
			firstName: 'Albert',
			lastName: 'van Andel',
		},
	});
	const user3 = await prisma.user.upsert({
		where: { loginName: 'Jorien' },
		update: {},
		create: {
			userName: 'AwesomeFrontendCreator',
			loginName: 'Jorien',
			email: 'jaberkro@student.codam.nl',
			hash: 'pwd',
			firstName: 'Jorien',
			lastName: 'Aberkrom',
		},
	});
	const user4 = await prisma.user.upsert({
		where: { loginName: 'Carlo' },
		update: {},
		create: {
			userName: 'AwesomeGameCreator',
			loginName: 'Carlo',
			email: 'cwesseli@student.codam.nl',
			hash: 'pwd',
			firstName: 'Carlo',
			lastName: 'Wesseling',
		},
	});
	console.log({ user1, user2, user3, user4 });
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
