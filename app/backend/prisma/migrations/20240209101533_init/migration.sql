-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "loginName" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "userName" TEXT,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "token" TEXT,
    "avatarId" INTEGER,
    "online" INTEGER NOT NULL,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_loginName_key" ON "User"("loginName");
