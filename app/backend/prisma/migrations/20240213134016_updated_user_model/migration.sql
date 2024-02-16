/*
  Warnings:

  - Made the column `avatarId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarId" SET NOT NULL,
ALTER COLUMN "avatarId" SET DEFAULT 0,
ALTER COLUMN "online" SET DEFAULT 1;
