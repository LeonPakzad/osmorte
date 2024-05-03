-- DropForeignKey
ALTER TABLE `osm_cafe` DROP FOREIGN KEY `osm_Cafe_fk_placeId_fkey`;

-- DropForeignKey
ALTER TABLE `osm_fastfood` DROP FOREIGN KEY `osm_FastFood_fk_placeId_fkey`;

-- DropForeignKey
ALTER TABLE `osm_restaurant` DROP FOREIGN KEY `osm_Restaurant_fk_placeId_fkey`;

-- AddForeignKey
ALTER TABLE `osm_Restaurant` ADD CONSTRAINT `osm_Restaurant_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `osm_Cafe` ADD CONSTRAINT `osm_Cafe_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `osm_FastFood` ADD CONSTRAINT `osm_FastFood_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
