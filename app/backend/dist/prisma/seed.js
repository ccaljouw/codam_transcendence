"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map