/*
  Warnings:

  - You are about to drop the column `addr_Street` on the `place` table. All the data in the column will be lost.
  - Added the required column `addr_street` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `place` DROP COLUMN `addr_Street`,
    ADD COLUMN `addr_street` VARCHAR(191) NOT NULL;
