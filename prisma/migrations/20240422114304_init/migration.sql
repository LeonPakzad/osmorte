/*
  Warnings:

  - You are about to drop the column `created` on the `restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `restaurant` DROP COLUMN `created`,
    DROP COLUMN `updated`;
