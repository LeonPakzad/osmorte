/*
  Warnings:

  - You are about to drop the `place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `restaurant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `restaurant` DROP FOREIGN KEY `Restaurant_fk_placeId_fkey`;

-- DropTable
DROP TABLE `place`;

-- DropTable
DROP TABLE `restaurant`;

-- CreateTable
CREATE TABLE `OSM_Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `node` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NULL,
    `long` DOUBLE NULL,
    `city` VARCHAR(191) NULL,
    `housenumber` INTEGER NULL,
    `postcode` INTEGER NULL,
    `street` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OSM_Place_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OSM_Restaurant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `email` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `wheelchair` VARCHAR(191) NULL,
    `outdoor_seating` BOOLEAN NULL DEFAULT false,
    `dog` BOOLEAN NULL DEFAULT false,
    `cuisine` VARCHAR(191) NULL,
    `lunch` VARCHAR(191) NULL,
    `organic` VARCHAR(191) NULL,
    `takeaway` VARCHAR(191) NULL,
    `diet_kosher` BOOLEAN NULL DEFAULT false,
    `diet_halal` BOOLEAN NULL DEFAULT false,
    `diet_diabetes` BOOLEAN NULL DEFAULT false,
    `diet_vegan` BOOLEAN NULL DEFAULT false,
    `diet_vegetarian` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `OSM_Restaurant_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OSM_Restaurant` ADD CONSTRAINT `OSM_Restaurant_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `OSM_Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
