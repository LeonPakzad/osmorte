-- CreateTable
CREATE TABLE `osm_Doctors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `wheelchair` VARCHAR(191) NULL,

    UNIQUE INDEX `osm_Doctors_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `osm_Doctors` ADD CONSTRAINT `osm_Doctors_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
