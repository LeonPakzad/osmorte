/*
  Warnings:

  - You are about to alter the column `internet_access` on the `osm_bar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `osm_bar` MODIFY `internet_access` BOOLEAN NULL;
