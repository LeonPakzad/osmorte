-- DropForeignKey
ALTER TABLE `osm_restaurant` DROP FOREIGN KEY `OSM_Restaurant_fk_placeId_fkey`;

-- AddForeignKey
ALTER TABLE `osm_Restaurant` ADD CONSTRAINT `osm_Restaurant_fk_placeId_fkey` FOREIGN KEY (`fk_placeId`) REFERENCES `osm_Place`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `osm_Place_name_key` ON `osm_Place`(`name`);
DROP INDEX `OSM_Place_name_key` ON `osm_place`;

-- RedefineIndex
CREATE UNIQUE INDEX `osm_Restaurant_fk_placeId_key` ON `osm_Restaurant`(`fk_placeId`);
DROP INDEX `OSM_Restaurant_fk_placeId_key` ON `osm_restaurant`;
