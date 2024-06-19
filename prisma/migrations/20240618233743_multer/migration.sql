/*
  Warnings:

  - Added the required column `sobreMim` to the `UserEmpresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userempresa` ADD COLUMN `sobreMim` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `FotoPerfil` (
    `id_foto` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `caminho` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_foto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
