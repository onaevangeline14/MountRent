/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `DetailTransaksi` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `detailtransaksi` ADD COLUMN `idOrder` INTEGER NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `DetailTransaksi_uuid_key` ON `DetailTransaksi`(`uuid`);

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
