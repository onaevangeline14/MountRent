/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Order_uuid_key` ON `Order`(`uuid`);
