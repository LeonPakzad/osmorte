/*
  Warnings:

  - You are about to drop the column `cuisine` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `diet_vegan` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `diet_vegetarian` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `fk_place` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `opening_hours` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `place` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `place` DROP COLUMN `cuisine`,
    DROP COLUMN `diet_vegan`,
    DROP COLUMN `diet_vegetarian`,
    DROP COLUMN `email`,
    DROP COLUMN `fk_place`,
    DROP COLUMN `opening_hours`,
    DROP COLUMN `website`;

-- CreateTable
CREATE TABLE `Restaurant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `email` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `wheelchair` VARCHAR(191) NULL,
    `outdoor_seating` BOOLEAN NOT NULL DEFAULT false,
    `dog` BOOLEAN NOT NULL DEFAULT false,
    `cuisine` VARCHAR(191) NULL,
    `lunch` VARCHAR(191) NULL,
    `organic` VARCHAR(191) NULL,
    `takeaway` BOOLEAN NOT NULL DEFAULT false,
    `diet_kosher` BOOLEAN NOT NULL DEFAULT false,
    `diet_halal` BOOLEAN NOT NULL DEFAULT false,
    `diet_diabetes` BOOLEAN NOT NULL DEFAULT false,
    `diet_vegan` BOOLEAN NOT NULL DEFAULT false,
    `diet_vegetarian` BOOLEAN NOT NULL DEFAULT false,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Restaurant_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Restaurant` ADD CONSTRAINT `Restaurant_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
