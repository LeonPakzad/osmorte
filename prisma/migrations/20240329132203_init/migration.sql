-- CreateTable
CREATE TABLE `Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_place` INTEGER NOT NULL,
    `node` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NOT NULL,
    `Opening_hours` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `long` DOUBLE NOT NULL,
    `addr_city` VARCHAR(191) NOT NULL,
    `addr_housenumber` INTEGER NOT NULL,
    `addr_postcode` INTEGER NOT NULL,
    `addr_Street` VARCHAR(191) NOT NULL,
    `cuisine` VARCHAR(191) NOT NULL,
    `diet_vegan` BOOLEAN NOT NULL,
    `diet_vegetarian` BOOLEAN NOT NULL,

    UNIQUE INDEX `Place_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
