-- AlterTable
ALTER TABLE `place` MODIFY `fk_place` INTEGER NULL,
    MODIFY `node` INTEGER NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `website` VARCHAR(191) NULL,
    MODIFY `lat` DOUBLE NULL,
    MODIFY `long` DOUBLE NULL,
    MODIFY `cuisine` VARCHAR(191) NULL,
    MODIFY `opening_hours` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `housenumber` INTEGER NULL,
    MODIFY `postcode` INTEGER NULL,
    MODIFY `street` VARCHAR(191) NULL;
