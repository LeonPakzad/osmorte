/*
  Warnings:

  - You are about to drop the column `dog` on the `osm_university` table. All the data in the column will be lost.
  - You are about to drop the column `outdoor_seating` on the `osm_university` table. All the data in the column will be lost.
  - You are about to drop the column `wheelchair` on the `osm_university` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `osm_university` DROP COLUMN `dog`,
    DROP COLUMN `outdoor_seating`,
    DROP COLUMN `wheelchair`;

-- CreateTable
CREATE TABLE `osm_School` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `old_name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `grades` VARCHAR(191) NULL,
    `isced` VARCHAR(191) NULL,
    `wheelchar` VARCHAR(191) NULL,
    `wikipedia` VARCHAR(191) NULL,

    UNIQUE INDEX `osm_School_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `osm_School` ADD CONSTRAINT `osm_School_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
