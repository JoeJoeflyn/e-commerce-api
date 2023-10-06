/*
  Warnings:

  - You are about to drop the column `remember_token` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "remember_token";

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
