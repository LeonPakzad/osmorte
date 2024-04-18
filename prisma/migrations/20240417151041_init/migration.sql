/*
  Warnings:

  - You are about to drop the column `addr_city` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `addr_housenumber` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `addr_postcode` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `addr_street` on the `place` table. All the data in the column will be lost.
  - Added the required column `city` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `housenumber` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `place` DROP COLUMN `addr_city`,
    DROP COLUMN `addr_housenumber`,
    DROP COLUMN `addr_postcode`,
    DROP COLUMN `addr_street`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `housenumber` INTEGER NOT NULL,
    ADD COLUMN `postcode` INTEGER NOT NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL,
    MODIFY `diet_vegan` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `diet_vegetarian` BOOLEAN NOT NULL DEFAULT false;
