/*
  Warnings:

  - You are about to drop the column `idKaryawan` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the `karyawan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Transaksi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_idKaryawan_fkey`;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `idKaryawan`,
    ADD COLUMN `tanggal_kembali` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('Karyawan', 'Customer') NOT NULL DEFAULT 'Customer',
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `karyawan`;

-- CreateIndex
CREATE UNIQUE INDEX `Transaksi_uuid_key` ON `Transaksi`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_uuid_key` ON `User`(`uuid`);
