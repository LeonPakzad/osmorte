-- CreateTable
CREATE TABLE `osm_Bar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `smoking` BOOLEAN NULL,
    `internet_access` BOOLEAN NULL,
    `wheelchair` VARCHAR(191) NULL,
    `outdoor_seating` BOOLEAN NULL DEFAULT false,
    `indoor_seating` BOOLEAN NULL DEFAULT false,
    `dog` BOOLEAN NULL DEFAULT false,
    `cuisine` VARCHAR(191) NULL,
    `organic` VARCHAR(191) NULL,
    `takeaway` VARCHAR(191) NULL,
    `brewery` BOOLEAN NULL DEFAULT false,
    `diet_kosher` BOOLEAN NULL DEFAULT false,
    `diet_halal` BOOLEAN NULL DEFAULT false,
    `diet_diabetes` BOOLEAN NULL DEFAULT false,
    `diet_vegan` BOOLEAN NULL DEFAULT false,
    `diet_vegetarian` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `osm_Bar_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `osm_Bar` ADD CONSTRAINT `osm_Bar_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
