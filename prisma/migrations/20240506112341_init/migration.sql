/*
  Warnings:

  - You are about to alter the column `internet_access` on the `osm_bar` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `osm_bar` MODIFY `internet_access` VARCHAR(191) NULL;
