/*
  Warnings:

  - You are about to drop the column `Opening_hours` on the `place` table. All the data in the column will be lost.
  - Added the required column `opening_hours` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `place` DROP COLUMN `Opening_hours`,
    ADD COLUMN `opening_hours` VARCHAR(191) NOT NULL;
