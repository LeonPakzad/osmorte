-- AlterTable
ALTER TABLE `osm_doctors` ADD COLUMN `emergency` BOOLEAN NULL,
    ADD COLUMN `healthcare` VARCHAR(191) NULL,
    ADD COLUMN `speciality` VARCHAR(191) NULL;
