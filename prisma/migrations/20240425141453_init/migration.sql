-- CreateTable
CREATE TABLE `osm_Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `node` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `lat` DOUBLE NULL,
    `long` DOUBLE NULL,
    `city` VARCHAR(191) NULL,
    `housenumber` INTEGER NULL,
    `postcode` INTEGER NULL,
    `street` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `osm_Place_node_key`(`node`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `osm_Restaurant` (
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

    UNIQUE INDEX `osm_Restaurant_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `osm_Cafe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `opening_hours` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `smoking` BOOLEAN NULL,
    `self_service` BOOLEAN NULL,
    `wheelchair` VARCHAR(191) NULL,
    `outdoor_seating` BOOLEAN NULL DEFAULT false,
    `indoor_seating` BOOLEAN NULL DEFAULT false,
    `dog` BOOLEAN NULL DEFAULT false,
    `cuisine` VARCHAR(191) NULL,
    `organic` VARCHAR(191) NULL,
    `takeaway` VARCHAR(191) NULL,
    `ice_cream` BOOLEAN NULL,
    `bakery` BOOLEAN NULL,
    `pastry` BOOLEAN NULL,
    `diet_kosher` BOOLEAN NULL DEFAULT false,
    `diet_halal` BOOLEAN NULL DEFAULT false,
    `diet_diabetes` BOOLEAN NULL DEFAULT false,
    `diet_vegan` BOOLEAN NULL DEFAULT false,
    `diet_vegetarian` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `osm_Cafe_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `osm_FastFood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_placeId` INTEGER NOT NULL,
    `operator` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `cuisine` VARCHAR(191) NULL,
    `organic` VARCHAR(191) NULL,
    `takeaway` VARCHAR(191) NULL,
    `delivery` VARCHAR(191) NULL,
    `drive_through` BOOLEAN NULL DEFAULT false,
    `drive_in` BOOLEAN NULL DEFAULT false,
    `opening_hours` VARCHAR(191) NULL,
    `wheelchair` VARCHAR(191) NULL,
    `outdoor_seating` BOOLEAN NULL DEFAULT false,
    `capacity` VARCHAR(191) NULL,
    `dog` BOOLEAN NULL DEFAULT false,
    `ice_cream` BOOLEAN NULL DEFAULT false,
    `bakery` BOOLEAN NULL DEFAULT false,
    `pastry` BOOLEAN NULL DEFAULT false,
    `diet_kosher` BOOLEAN NULL DEFAULT false,
    `diet_halal` BOOLEAN NULL DEFAULT false,
    `diet_diabetes` BOOLEAN NULL DEFAULT false,
    `diet_vegan` BOOLEAN NULL DEFAULT false,
    `diet_vegetarian` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `osm_FastFood_fk_placeId_key`(`fk_placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `osm_Restaurant` ADD CONSTRAINT `osm_Restaurant_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `osm_Cafe` ADD CONSTRAINT `osm_Cafe_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `osm_FastFood` ADD CONSTRAINT `osm_FastFood_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
