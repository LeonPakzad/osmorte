/*
  Warnings:

  - You are about to alter the column `takeaway` on the `restaurant` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `restaurant` MODIFY `takeaway` VARCHAR(191) NULL;
