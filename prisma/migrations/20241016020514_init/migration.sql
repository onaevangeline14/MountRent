/*
  Warnings:

  - You are about to drop the column `Stock` on the `alat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `alat` DROP COLUMN `Stock`,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';
