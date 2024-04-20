-- AlterTable
ALTER TABLE `restaurant` MODIFY `outdoor_seating` BOOLEAN NULL DEFAULT false,
    MODIFY `dog` BOOLEAN NULL DEFAULT false,
    MODIFY `takeaway` BOOLEAN NULL DEFAULT false,
    MODIFY `diet_kosher` BOOLEAN NULL DEFAULT false,
    MODIFY `diet_halal` BOOLEAN NULL DEFAULT false,
    MODIFY `diet_diabetes` BOOLEAN NULL DEFAULT false,
    MODIFY `diet_vegan` BOOLEAN NULL DEFAULT false,
    MODIFY `diet_vegetarian` BOOLEAN NULL DEFAULT false;
