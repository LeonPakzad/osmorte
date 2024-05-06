/*
  Warnings:

  - You are about to drop the column `wheelchar` on the `osm_school` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `osm_school` DROP COLUMN `wheelchar`,
    ADD COLUMN `wheelchair` VARCHAR(191) NULL;
