-- CreateTable
CREATE TABLE `osm_ATM` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `network` VARCHAR(191) NULL,
    `level` INTEGER NULL,
    `cash_in` BOOLEAN NULL,
    `indoor` BOOLEAN NULL,
    `man_made` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `wheelchair` VARCHAR(191) NULL,
    `surveillence` VARCHAR(191) NULL,

    UNIQUE INDEX `osm_ATM_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `osm_ATM` ADD CONSTRAINT `osm_ATM_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
