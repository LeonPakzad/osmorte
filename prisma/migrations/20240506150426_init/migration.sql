/*
  Warnings:

  - You are about to drop the column `wheelchar` on the `osm_university` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `osm_university` DROP COLUMN `wheelchar`,
    ADD COLUMN `wheelchair` VARCHAR(191) NULL;
