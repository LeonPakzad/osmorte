-- CreateTable
CREATE TABLE `osm_University` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `internet_access` VARCHAR(191) NULL,
    `internet_access_fee` VARCHAR(191) NULL,
    `office` VARCHAR(191) NULL,
    `wheelchar` VARCHAR(191) NULL,
    `wikipedia` VARCHAR(191) NULL,
    `wheelchair` VARCHAR(191) NULL,
    `outdoor_seating` BOOLEAN NULL DEFAULT false,
    `dog` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `osm_University_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `osm_University` ADD CONSTRAINT `osm_University_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
